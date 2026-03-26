-- Create a view for community feed with like/comment counts
CREATE OR REPLACE VIEW community_feed AS
SELECT 
  gi.id,
  gi.title,
  gi.description,
  gi.image_url,
  gi.user_id,
  gi.created_at,
  p.full_name,
  p.email,
  COALESCE(like_counts.like_count, 0) as like_count,
  COALESCE(comment_counts.comment_count, 0) as comment_count
FROM generated_images gi
LEFT JOIN profiles p ON gi.user_id = p.id
LEFT JOIN (
  SELECT image_id, COUNT(*) as like_count
  FROM community_likes
  GROUP BY image_id
) like_counts ON gi.id = like_counts.image_id
LEFT JOIN (
  SELECT image_id, COUNT(*) as comment_count
  FROM community_comments
  GROUP BY image_id
) comment_counts ON gi.id = comment_counts.image_id
WHERE gi.is_public = true
ORDER BY gi.created_at DESC;

-- Grant access to the view
GRANT SELECT ON community_feed TO authenticated;
GRANT SELECT ON community_feed TO anon;