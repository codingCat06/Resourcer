import pool from '../models/db';

interface EarningsData {
  userId: number;
  postId: number;
  clicks: number;
  adRevenue: number;
}

export class EarningsCalculator {
  private static readonly PLATFORM_FEE_PERCENTAGE = 0.30; // 30% platform fee
  private static readonly MIN_CLICKS_FOR_EARNINGS = 100;

  static async calculateAndRecordEarnings(data: EarningsData): Promise<void> {
    const { userId, postId, clicks, adRevenue } = data;

    // Only calculate earnings if minimum clicks threshold is met
    if (clicks < this.MIN_CLICKS_FOR_EARNINGS) {
      return;
    }

    const platformFee = adRevenue * this.PLATFORM_FEE_PERCENTAGE;
    const userEarnings = adRevenue - platformFee;

    try {
      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // Insert earnings record
        await connection.execute(`
          INSERT INTO earnings (user_id, post_id, amount, clicks_count, earnings_date, ad_revenue, platform_fee)
          VALUES (?, ?, ?, ?, CURDATE(), ?, ?)
          ON DUPLICATE KEY UPDATE
            amount = amount + VALUES(amount),
            clicks_count = clicks_count + VALUES(clicks_count),
            ad_revenue = ad_revenue + VALUES(ad_revenue),
            platform_fee = platform_fee + VALUES(platform_fee)
        `, [userId, postId, userEarnings, clicks, adRevenue, platformFee]);

        // Update user's total earnings
        await connection.execute(`
          UPDATE users 
          SET total_earnings = total_earnings + ?
          WHERE id = ?
        `, [userEarnings, userId]);

        // Update post's total earnings
        await connection.execute(`
          UPDATE posts 
          SET total_earnings = total_earnings + ?, last_earnings_date = CURDATE()
          WHERE id = ?
        `, [userEarnings, postId]);

        await connection.commit();
        console.log(`Recorded earnings: $${userEarnings.toFixed(4)} for user ${userId}, post ${postId}`);
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error calculating earnings:', error);
      throw error;
    }
  }

  static async processAllEligiblePosts(): Promise<void> {
    try {
      // Get posts that haven't had earnings calculated today
      const [posts] = await pool.execute(`
        SELECT p.id, p.user_id, p.click_count, p.last_earnings_date
        FROM posts p
        WHERE p.status = 'published' 
          AND p.click_count >= ?
          AND (p.last_earnings_date IS NULL OR p.last_earnings_date < CURDATE())
      `, [this.MIN_CLICKS_FOR_EARNINGS]);

      for (const post of (posts as any[])) {
        // Calculate clicks since last earnings calculation
        const clicksSinceLastEarnings = post.last_earnings_date 
          ? await this.getClicksSinceDate(post.id, post.last_earnings_date)
          : post.click_count;

        if (clicksSinceLastEarnings > 0) {
          // Simulate Google Ads revenue calculation
          // In real implementation, this would come from Google Ads API
          const estimatedAdRevenue = this.estimateAdRevenue(clicksSinceLastEarnings);
          
          await this.calculateAndRecordEarnings({
            userId: post.user_id,
            postId: post.id,
            clicks: clicksSinceLastEarnings,
            adRevenue: estimatedAdRevenue
          });
        }
      }
    } catch (error) {
      console.error('Error processing earnings:', error);
    }
  }

  private static async getClicksSinceDate(postId: number, date: string): Promise<number> {
    const [result] = await pool.execute(`
      SELECT COUNT(*) as clicks
      FROM post_clicks
      WHERE post_id = ? AND clicked_at > ?
    `, [postId, date]);

    return (result as any[])[0].clicks;
  }

  private static estimateAdRevenue(clicks: number): number {
    // Estimated revenue per click (this would come from actual Google Ads data)
    // Average CPM (cost per mille) of $2-$5, with average CTR of 2%
    const avgRevenuePerClick = 0.02; // $0.02 per click
    return clicks * avgRevenuePerClick;
  }
}

// Google Ads Integration (placeholder for actual implementation)
export class GoogleAdsIntegration {
  private static clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  private static clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  private static developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

  static async getAdRevenue(postId: number, dateFrom: string, dateTo: string): Promise<number> {
    // This is a placeholder - in real implementation, you would:
    // 1. Use Google Ads API to get actual revenue data
    // 2. Filter by website/page URL corresponding to the post
    // 3. Return actual revenue for the specified date range
    
    console.log(`Fetching Google Ads revenue for post ${postId} from ${dateFrom} to ${dateTo}`);
    
    // For now, return estimated revenue
    return EarningsCalculator['estimateAdRevenue'](10); // Assume 10 clicks generated revenue
  }

  static async setupAdUnits(postId: number, postUrl: string): Promise<string> {
    // This would create ad units for the specific post
    // and return the ad unit ID
    console.log(`Setting up ad unit for post ${postId} at ${postUrl}`);
    return `ad-unit-${postId}-${Date.now()}`;
  }
}