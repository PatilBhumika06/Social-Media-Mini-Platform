# Story Features Documentation

This document outlines all the story features available to users in the social media application.

## Available Endpoints

### Creating Stories
- `POST /api/stories` - Create a new story
- `POST /api/stories/upload` - Create a story with file upload

### Viewing Stories
- `GET /api/stories` - Get stories from followed users and own stories
- `GET /api/stories/my-stories` - Get stories grouped by user
- `GET /api/stories/feed` - Get stories from followed users only
- `GET /api/stories/user/:userId` - Get stories for a specific user
- `GET /api/stories/:id` - Get a specific story

### Managing Stories
- `DELETE /api/stories/:id` - Delete a specific story (owner only)
- `DELETE /api/stories` - Delete multiple stories (owner only)
- `POST /api/stories/view/:id` - Mark a story as viewed
- `POST /api/stories/share/:id` - Share a story
- `GET /api/stories/analytics/:id` - Get story analytics (owner only)

### System Management
- `GET /api/stories/expired` - Get expired stories (admin only)

## Features for All Users

All registered users have access to:

1. **Create Stories** - Share images/videos with followers
2. **View Stories** - See stories from followed users
3. **Share Stories** - Share interesting stories with others
4. **View Own Stories** - Access their own posted stories
5. **Manage Stories** - Delete their own stories
6. **Track Views** - See which stories they've viewed

## Authentication

All story endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Story Lifecycle

1. Stories are created with a 24-hour expiration
2. Expired stories are automatically cleaned up
3. Users can only manage their own stories
4. Stories are only visible to followers and the creator