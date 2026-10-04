# System Documentation

## 1. Event List

List and describe all major events in the system (e.g., user registration, post creation, story view, etc.).

### Authentication Events
| Event Name | Description | Triggered By | System Response |
|------------|-------------|--------------|-----------------|
| User Registration | New user creates an account with email, username, and password | Signup screen/form submission | Creates new user document, generates JWT token, returns user data |
| User Login | Existing user authenticates with credentials | Login screen/form submission | Validates credentials, generates JWT token, returns user data |
| User Logout | User ends their session | Logout button/action | Invalidates session/token, clears user data from client |
| Password Change | User updates their password | Settings/Profile screen | Validates current password, updates hash, sends confirmation |
| Password Reset | User requests password reset via email | Forgot password form | Sends reset link/token to email, updates password on verification |

### Content Creation Events
| Event Name | Description | Triggered By | System Response |
|------------|-------------|--------------|-----------------|
| Post Creation | User creates a new post with image/video and caption | Create post screen | Uploads media, creates post document, adds to user's posts array |
| Story Creation | User creates a 24-hour story with image/video | Create story screen | Uploads media, creates story document with expiration timestamp |
| Reel Creation | User creates a short video reel | Reels creation screen | Uploads video, creates reel document, adds to user's reels |
| Comment Creation | User adds comment to post/reel | Comment input field | Creates comment document, adds to parent's comments array |
| Media Upload | User uploads image/video file | Any media selection | Processes and stores file, returns URL for database storage |

### Social Interaction Events
| Event Name | Description | Triggered By | System Response |
|------------|-------------|--------------|-----------------|
| Follow User | User follows another user | Profile screen follow button | Adds user to follower's following array, adds follower to user's followers |
| Unfollow User | User stops following another user | Profile screen unfollow button | Removes user from follower's following array and vice versa |
| Like Post | User likes a post | Post like button | Adds user to post's likes array, sends notification to post owner |
| Unlike Post | User removes like from post | Post like button (when already liked) | Removes user from post's likes array |
| Like Story | User likes a story | Story view screen | Adds user to story's likes array |
| View Story | User views another user's story | Story feed/reel | Adds user to story's views array, increments view count |
| Reply to Story | User replies to a story | Story view screen | Creates reply document, adds to story's replies array |

### Communication Events
| Event Name | Description | Triggered By | System Response |
|------------|-------------|--------------|-----------------|
| Send Message | User sends direct message to another user | Chat screen input | Creates message document, stores in database, sends via WebSocket |
| Send Media Message | User sends image/video in chat | Chat media picker | Uploads media, creates message with media URL/type |
| Send Reel Share | User shares a reel via DM | Reel share button | Creates reel share message with reference to original reel |
| React to Message | User adds emoji reaction to message | Message long press | Adds reaction to message's reactions array |
| Unsend Message | User deletes their sent message | Message options menu | Marks message as unsent, preserves for recipient |
| Mark as Read | User reads unread message | Message view | Updates message read status, sends read receipt |

### Privacy & Security Events
| Event Name | Description | Triggered By | System Response |
|------------|-------------|--------------|-----------------|
| Block User | User blocks another user | Profile/Settings screen | Adds user to blockedUsers array, prevents interactions |
| Unblock User | User removes block on another user | Blocked accounts screen | Removes user from blockedUsers array |
| Change Privacy Setting | User changes account privacy | Privacy settings screen | Updates user privacy field (public/private) |
| Accept Follow Request | Private user accepts follow request | Follow requests screen | Moves requester from followRequests to followers |
| Reject Follow Request | Private user rejects follow request | Follow requests screen | Removes requester from followRequests |

### Administrative Events
| Event Name | Description | Triggered By | System Response |
|------------|-------------|--------------|-----------------|
| User Report | Admin reports inappropriate content/user | Admin panel | Flags content/user for review |
| Content Removal | Admin removes inappropriate content | Admin panel | Deletes content document, notifies affected users |
| User Suspension | Admin suspends user account | Admin panel | Sets user isBlocked flag, prevents login |
| System Maintenance | Scheduled system maintenance | Admin action | Performs cleanup, database optimization |

### Real-time Events (WebSocket)
| Event Name | Description | Triggered By | System Response |
|------------|-------------|--------------|-----------------|
| New Message Notification | Real-time message delivery | Message sent | Pushes message to recipient via WebSocket |
| New Follower Notification | Real-time follow notification | User followed | Pushes notification to followed user |
| Like Notification | Real-time like notification | Post/Story liked | Pushes notification to content owner |
| Comment Notification | Real-time comment notification | Comment added | Pushes notification to post owner |
| Reel Share Notification | Real-time reel share notification | Reel shared via DM | Pushes notification to reel owner |
| Online Status Update | User connection status change | User login/logout | Updates user online status for others |

### Media Management Events
| Event Name | Description | Triggered By | System Response |
|------------|-------------|--------------|-----------------|
| Media Upload Start | User begins media upload process | File selection | Initializes upload process, validates file type/size |
| Media Upload Progress | Upload progress update | During upload | Updates progress indicator on client |
| Media Upload Complete | Media successfully uploaded | Upload completion | Returns media URL, enables post/story creation |
| Media Upload Error | Upload process failed | Network/Server error | Displays error message, allows retry |
| Media Deletion | User deletes uploaded media | Edit/Delete action | Removes file from storage, updates database references |

### System Cleanup Events
| Event Name | Description | Triggered By | System Response |
|------------|-------------|--------------|-----------------|
| Story Expiration | Automatic deletion of 24-hour stories | Timer/Cron job | Removes expired stories from database/storage |
| Session Cleanup | Removal of expired user sessions | Session management | Invalidates expired JWT tokens |
| Temporary File Cleanup | Removal of unused temporary files | Cleanup script | Deletes orphaned/temporary files from storage |
| Database Optimization | Performance optimization of database | Maintenance script | Indexes optimization, data compaction |