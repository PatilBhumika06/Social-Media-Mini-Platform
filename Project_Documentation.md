# Project Documentation

## 1. Files

List and describe the main files and their purposes in the project.

### Backend Structure (/backend/)

#### Configuration Files
| File/Folder Name | Description | Key Responsibilities |
|------------------|-------------|----------------------|
| `config/db.js` | Database configuration | Connects to MongoDB, exports connection function |
| `config/.env` | Environment variables | Stores API keys, database URIs, server port configurations |

#### Main Application Files
| File/Folder Name | Description | Key Responsibilities |
|------------------|-------------|----------------------|
| `server.js` | Main server application | Express server setup, routes registration, middleware configuration, WebSocket initialization |
| `socket.js` | WebSocket configuration | Real-time communication setup for messages and notifications |
| `package.json` | Node.js dependencies | Lists all backend dependencies (express, mongoose, socket.io, etc.) |

#### Models (/models/)
| File Name | Description | Schema Structure |
|-----------|-------------|------------------|
| `User.js` | User data model | username, email, password, fullName, bio, profilePic, followers, following, posts, stories, privacy settings, blocked users |
| `Post.js` | Post data model | user reference, caption, imageUrl, mediaUrl, mediaType, likes, comments, createdAt |
| `Story.js` | Story data model | user reference, imageUrl, isVideo, caption, audience, views, likes, replies, expiresAt (24-hour expiry) |
| `Message.js` | Message data model | sender, receiver, content, mediaUrl, mediaType, reactions, messageType, read/delivered status, unsent functionality |
| `Reel.js` | Reel data model | user reference, videoUrl, caption, likes, comments, shares |
| `ReelShare.js` | Reel share model | reel reference, sharedBy, sharedWith, message |
| `Comment.js` | Comment model | user reference, parent reference (post/story/reel), text, createdAt |
| `Activity.js` | User activity tracking | user reference, activity type, target reference, timestamp |

#### Controllers (/controllers/)
| File Name | Description | Main Functions |
|-----------|-------------|----------------|
| `authController.js` | Authentication logic | register, login, logout, changePassword, resetPassword |
| `postController.js` | Post management | createPost, getPosts, likePost, commentOnPost, deletePost |
| `storyController.js` | Story management | createStory, getStories, viewStory, deleteStory, getStoryViews |

#### Routes (/routes/)
| File Name | Description | Endpoints Covered |
|-----------|-------------|-------------------|
| `auth.js` | Authentication routes | POST /register, POST /login, POST /logout |
| `users.js` | User management routes | GET /users, GET /users/:id, PUT /users/:id, follow/unfollow endpoints |
| `posts.js` | Post-related routes | GET /posts, POST /posts, PUT /posts/:id/like, POST /posts/:id/comment |
| `stories.js` | Story-related routes | GET /stories, POST /stories, DELETE /stories/:id, GET /stories/:id/views |
| `messages.js` | Messaging routes | GET /messages, POST /messages, PUT /messages/:id/react, DELETE /messages/:id |
| `reels.js` | Reel-related routes | GET /reels, POST /reels, POST /reels/:id/share, GET /reels/feed |
| `admin.js` | Administrative routes | User management, content moderation, system reports |
| `privacy.js` | Privacy settings routes | Block/unblock users, privacy level changes, follow requests |

#### Middleware (/middleware/)
| File Name | Description | Functionality |
|-----------|-------------|---------------|
| `auth.js` | Authentication middleware | JWT token verification, user authentication |
| `admin.js` | Admin authorization | Restricts access to admin-only endpoints |
| `profileAccess.js` | Profile access control | Manages privacy settings and access permissions |

#### Uploads Directory (/uploads/)
| Folder Name | Description | Content Type |
|-------------|-------------|--------------|
| `profile-pics/` | User profile pictures | Images (JPEG, PNG) |
| `post-images/` | Post images | Images (JPEG, PNG) |
| `post-videos/` | Post videos | Videos (MP4, MOV) |
| `reel-videos/` | Reel videos | Videos (MP4, MOV) |
| `story-media/` | Story media files | Images and videos |
| `message-media/` | Message media attachments | Images and videos |

#### Scripts Directory (/scripts/)
| File Name | Description | Purpose |
|-----------|-------------|---------|
| `cleanup_expired_stories.js` | Story cleanup script | Removes expired 24-hour stories |
| `create_users.js` | User creation script | Bulk user account creation for testing |

#### Test Scripts (Root Directory)
| File Name | Description | Testing Focus |
|-----------|-------------|---------------|
| `test_auth.js` | Authentication tests | User registration, login, logout functionality |
| `test_posts_api.js` | Post API tests | Post creation, retrieval, liking, commenting |
| `test_stories.js` | Story tests | Story creation, viewing, expiration |
| `test_reels.js` | Reel tests | Reel creation, sharing, feed functionality |
| `test_messages.js` | Messaging tests | Direct messages, media sharing, reactions |
| `test_follow_api.js` | Follow system tests | Follow/unfollow functionality |
| `test_comment.js` | Comment tests | Comment creation and management |
| `test_block_functionality.js` | Blocking tests | User blocking and privacy features |
| `test_websocket_notifications.js` | Real-time tests | WebSocket message delivery and notifications |

### Frontend Structure (/frontend/social_media_app/)

#### Core Configuration
| File/Folder Name | Description | Purpose |
|------------------|-------------|---------|
| `pubspec.yaml` | Flutter dependencies | Lists all Flutter packages and dependencies |
| `lib/main.dart` | Main application entry | App initialization, theme setup, route configuration |

#### Models (/lib/models/)
| File Name | Description | Data Structure |
|-----------|-------------|----------------|
| `user.dart` | User data model | username, email, fullName, bio, profilePic, followers count, following count |
| `post.dart` | Post data model | id, user, caption, imageUrl, mediaUrl, likes count, comments count, createdAt |
| `story.dart` | Story data model | id, user, imageUrl, isVideo, views count, likes count, createdAt |
| `notification.dart` | Notification model | type, message, timestamp, read status |

#### Services (/lib/services/)
| File Name | Description | Key Functions |
|-----------|-------------|---------------|
| `api_service.dart` | API communication | HTTP requests to backend endpoints |
| `user_service.dart` | User management | User data handling, authentication state |
| `websocket_service.dart` | Real-time communication | WebSocket connection management, message handling |
| `media_service.dart` | Media handling | Image/video selection, upload processing |
| `notification_service.dart` | Notification management | Local and push notifications |

#### Screens (/lib/screens/)
| File Name | Description | Main Features |
|-----------|-------------|---------------|
| `login_screen.dart` | User authentication | Email/password login, validation |
| `signup_screen.dart` | User registration | Account creation form |
| `home_screen.dart` | Main navigation | Bottom navigation bar |
| `feed_screen.dart` | Main content feed | Posts display, infinite scroll |
| `profile_screen.dart` | User profile | Posts grid, story highlights, edit profile |
| `create_post_screen.dart` | Post creation | Media selection, caption input |
| `create_story_screen.dart` | Story creation | Camera/gallery integration |
| `story_view_screen.dart` | Story viewing | Full-screen story display, reactions |
| `chat_list_screen.dart` | Chat list | Conversations list, search |
| `chat_screen.dart` | Chat interface | Message sending, media sharing |
| `chat_screen_with_voice.dart` | Voice messaging | Voice recording and playback |
| `reels_screen.dart` | Reels feed | Vertical video feed, likes/comments |
| `reels_browser_screen.dart` | Reels browsing | Reel discovery and search |
| `reel_share_screen.dart` | Reel sharing | Share reels via DM |
| `search_screen.dart` | User/content search | Search functionality |
| `activity_screen.dart` | Notifications | Like, comment, follow notifications |
| `privacy_settings_screen.dart` | Privacy controls | Account privacy, blocked users |
| `blocked_accounts_screen.dart` | Blocked users list | View and manage blocked accounts |
| `followers_following_screen.dart` | Social connections | View followers/following lists |
| `user_profile_screen.dart` | Other user profiles | View public profiles, follow actions |
| `comments_screen.dart` | Comment section | View and add comments |
| `admin_screen.dart` | Admin panel | User management, content moderation |

#### Utilities (/lib/utils/)
| File Name | Description | Functionality |
|-----------|-------------|---------------|
| `constants.dart` | Application constants | API URLs, color schemes, sizing |

#### Widgets (/lib/widgets/)
| File Name | Description | Reusable Components |
|-----------|-------------|-------------------|
| `post_widget.dart` | Post display component | Post image, caption, engagement metrics |
| `story_widget.dart` | Story display component | Circular story thumbnails |

#### Configuration (/lib/config/)
| File Name | Description | Configuration |
|-----------|-------------|----------------|
| `api_config.dart` | API configuration | Base URLs, timeout settings |

### Media Assets (/imagesvideos/)
| File Name | Description | Usage |
|-----------|-------------|-------|
| `Firstvideo.mp4` | Sample video content | Testing and demonstration purposes |

### Documentation Files
| File Name | Description | Content |
|-----------|-------------|---------|
| `README.md` | Project overview | Basic project information and setup instructions |
| `System_Documentation.md` | System architecture | Event list, system components |
| `Project_Documentation.md` | File structure | This document - project file organization |
| `Test_Cases_Analysis_Report.md` | Testing documentation | Test cases, results, analysis |
| `Bibliography_References.md` | References | Libraries, frameworks, resources used |
| `FEATURE_ACCESS_GUIDE.md` | Feature guide | How to access and use different features |
| `README_STORY_FEATURES.md` | Story features | Detailed story functionality documentation |

### Additional Scripts (Root Directory)
| File Name | Description | Purpose |
|-----------|-------------|---------|
| `create_test_post.js` | Test post creation | Creates sample posts for testing |
| `create_test_story.js` | Test story creation | Creates sample stories for testing |
| `create_complete_user.js` | Complete user setup | Creates user with posts, stories, followers |
| `test_all_features.js` | Comprehensive testing | Tests all major features |
| `debug_*` | Debugging scripts | Various debugging utilities |
| `check_*` | Data verification | Scripts to check data integrity |
| `setup_*` | Setup scripts | Initial configuration and data setup |