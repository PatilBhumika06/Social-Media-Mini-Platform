#!/usr/bin/env python3
import re

# Read the file
with open(r"c:\Users\Bhumika\Desktop\Social media\frontend\social_media_app\lib\screens\user_profile_screen.dart", "r") as f:
    content = f.read()

# Fix the incorrectly escaped characters
content = content.replace("List<dynamic> userReels = \\[\\]; // Add reels list", "List<dynamic> userReels = []; // Add reels list")

# Write the file back
with open(r"c:\Users\Bhumika\Desktop\Social media\frontend\social_media_app\lib\screens\user_profile_screen.dart", "w") as f:
    f.write(content)

print("File fixed successfully!")