import express from 'express';
import { OpenAI } from 'openai';
import pool from '../models/db';

const router = express.Router();

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Search posts using OpenAI
router.post('/', async (req, res) => {
  try {
    const { query, workEnvironment } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ message: 'Valid query is required' });
    }

    const trimmedQuery = query.trim();
    const envArray = Array.isArray(workEnvironment) ? workEnvironment : [];

    // Log search query (don't fail the search if logging fails)
    try {
      await pool.execute(`
        INSERT INTO search_queries (query_text, work_environment, searched_at)
        VALUES (?, ?, NOW())
      `, [trimmedQuery, JSON.stringify(envArray)]);
    } catch (logError) {
      console.error('Failed to log search query:', logError);
    }

    let enhancedQuery = trimmedQuery;
    
    // Generate search embeddings and enhanced query using OpenAI (if available)
    if (openai) {
      try {
        const searchPrompt = `
          Based on the user's query: "${trimmedQuery}"
          ${envArray?.length ? `Work environment: ${envArray.join(', ')}` : ''}
          
          Create relevant search keywords that would help find API/module recommendations.
          Focus on technical terms, frameworks, libraries, and use cases.
        `;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: searchPrompt }],
          max_tokens: 150,
        });

        enhancedQuery = completion.choices[0]?.message?.content || trimmedQuery;
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
        // Continue with original query if OpenAI fails
        enhancedQuery = trimmedQuery;
      }
    }

    // Search in database using fulltext search and filters
    let searchSql = `
      SELECT p.*, u.username, u.full_name,
        MATCH(p.title, p.content, p.summary) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.status = 'published' 
        AND MATCH(p.title, p.content, p.summary) AGAINST(? IN NATURAL LANGUAGE MODE)
    `;
    
    const searchParams = [enhancedQuery, enhancedQuery];

    // Add work environment filter if provided
    if (envArray && envArray.length > 0) {
      const envConditions = envArray.map(() => 'JSON_SEARCH(p.work_environment, "one", ?) IS NOT NULL').join(' OR ');
      searchSql += ` AND (${envConditions})`;
      searchParams.push(...envArray);
    }

    searchSql += ' ORDER BY relevance DESC, p.click_count DESC LIMIT 20';

    let posts;
    try {
      [posts] = await pool.execute(searchSql, searchParams);
    } catch (searchError) {
      console.error('Database search error:', searchError);
      // Fallback to simple search without fulltext
      const fallbackSql = `
        SELECT p.*, u.username, u.full_name
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.status = 'published' 
          AND (p.title LIKE ? OR p.content LIKE ? OR p.summary LIKE ?)
        ORDER BY p.click_count DESC, p.created_at DESC 
        LIMIT 20
      `;
      const likeQuery = `%${trimmedQuery}%`;
      [posts] = await pool.execute(fallbackSql, [likeQuery, likeQuery, likeQuery]);
    }

    // Update search results count (don't fail if this errors)
    try {
      await pool.execute(`
        UPDATE search_queries 
        SET results_count = ? 
        WHERE query_text = ? AND searched_at >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)
        ORDER BY searched_at DESC LIMIT 1
      `, [(posts as any[]).length, trimmedQuery]);
    } catch (updateError) {
      console.error('Failed to update search results count:', updateError);
    }

    res.json({ posts, query: enhancedQuery });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;