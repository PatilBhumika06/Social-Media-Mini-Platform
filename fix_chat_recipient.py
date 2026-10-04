#!/usr/bin/env python3
# Script to fix the ChatScreen recipient parameter issue

import os

def fix_user_profile_screen():
    # Construct the correct file paths
    original_file = "frontend/social_media_app/lib/screens/user_profile_screen.dart"
    fixed_file = "frontend/social_media_app/lib/screens/user_profile_screen_fixed.dart"
    
    # Read the original file
    with open(original_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Define the old code block (creating User object)
    old_code = """final user = User(
      id: userProfile!['_id'],
      username: userProfile!['username'],
      fullName: userProfile!['fullName'],
      email: userProfile!['email'] ?? '',
    );"""
    
    # Define the new code block (creating Map object)
    new_code = """final user = {
      'id': userProfile!['_id'],
      'username': userProfile!['username'],
      'fullName': userProfile!['fullName'],
      'email': userProfile!['email'] ?? '',
      'profilePic': userProfile!['profilePic'] ?? '',
    };"""
    
    # Perform the replacement
    fixed_content = content.replace(old_code, new_code)
    
    # Write the fixed content to a new file
    with open(fixed_file, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"Fixed file created: {fixed_file}")

if __name__ == "__main__":
    fix_user_profile_screen()