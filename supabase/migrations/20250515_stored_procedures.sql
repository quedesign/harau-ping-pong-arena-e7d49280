
-- Create function to get followers
CREATE OR REPLACE FUNCTION public.get_athlete_followers(user_id UUID)
RETURNS TABLE (
  id UUID,
  follower_id UUID,
  athlete_id UUID,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT af.id, af.follower_id, af.athlete_id, af.created_at
  FROM public.athlete_followers af
  WHERE af.follower_id = user_id;
END;
$$;

-- Create function to follow an athlete
CREATE OR REPLACE FUNCTION public.follow_athlete(follower_user_id UUID, athlete_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result BOOLEAN;
BEGIN
  INSERT INTO public.athlete_followers (follower_id, athlete_id)
  VALUES (follower_user_id, athlete_user_id)
  ON CONFLICT (follower_id, athlete_id) DO NOTHING;
  
  GET DIAGNOSTICS result = ROW_COUNT;
  RETURN result > 0;
END;
$$;

-- Create function to unfollow an athlete
CREATE OR REPLACE FUNCTION public.unfollow_athlete(follower_user_id UUID, athlete_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result BOOLEAN;
BEGIN
  DELETE FROM public.athlete_followers
  WHERE follower_id = follower_user_id AND athlete_id = athlete_user_id;
  
  GET DIAGNOSTICS result = ROW_COUNT;
  RETURN result > 0;
END;
$$;

-- Create function to check if a user is following an athlete
CREATE OR REPLACE FUNCTION public.is_following_athlete(follower_user_id UUID, athlete_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.athlete_followers
    WHERE follower_id = follower_user_id AND athlete_id = athlete_user_id
  );
END;
$$;

-- Create helper functions for messaging
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conv_id UUID;
BEGIN
  -- Check if conversation exists
  SELECT c.id INTO conv_id
  FROM public.conversations c
  JOIN public.conversation_participants p1 ON p1.conversation_id = c.id AND p1.user_id = user1_id
  JOIN public.conversation_participants p2 ON p2.conversation_id = c.id AND p2.user_id = user2_id
  LIMIT 1;
  
  -- If not exists, create new conversation
  IF conv_id IS NULL THEN
    INSERT INTO public.conversations DEFAULT VALUES
    RETURNING id INTO conv_id;
    
    -- Add participants
    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES (conv_id, user1_id), (conv_id, user2_id);
  END IF;
  
  RETURN conv_id;
END;
$$;

-- Create function to send a message
CREATE OR REPLACE FUNCTION public.send_message(sender_id UUID, recipient_id UUID, message_content TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conv_id UUID;
  msg_id UUID;
BEGIN
  -- Get or create conversation
  SELECT public.get_or_create_conversation(sender_id, recipient_id) INTO conv_id;
  
  -- Insert message
  INSERT INTO public.messages (conversation_id, sender_id, content)
  VALUES (conv_id, sender_id, message_content)
  RETURNING id INTO msg_id;
  
  RETURN msg_id;
END;
$$;
