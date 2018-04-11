
# starter-module
Please use as base site for new site modules.

# (App name here) module starter kit
### Setup
1. Install [el-web-sdk](https://github.com/engagementgamelab/el-web-sdk).
2. Clone this repo (https://github.com/engagementgamelab/starter-module.git).
3. Link this module to el-web-sdk: 

  ```
  cd repo-name
  npm-link
  ```
  
  ```
  cd ../el-web-sdk
  npm link repo-name
  ```
  
4. Start the module. **From el-web-sdk**, run:

  ```
  grunt --sites=repo-name
  ```
The site should now be running at http://localhost:3000.

(More docs coming soon.)