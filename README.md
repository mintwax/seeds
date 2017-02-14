# seeds

React-native app that records and plays audio files.

# dev notes

Setting up react-native development on Windows 7

1. install python27
2. install vscode (code editor)
3. install java8
4. install git bash
5. install nodejs
6. install androidstudio, marshmallow sdk, intell haxm 
7. install yarn
8. install genymotion
9. install google play on genymotion - https://www.genymotion.com/help/desktop/faq/#google-play-services

To install app on xiaomi from windows
1. Install adb universal driver 3.0
2. Turn on developer mode, USB debugging
3. Turn off "MIUI optimization" for xiaomi

.bashrc
```
export ANDROID_HOME=/c/Users/Morris/AppData/Local/Android/sdk/
export PATH=$PATH:/c/Python27:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
export PATH=$PATH:/c/Yarn/bin
export JAVA_HOME=/c/Java/jdk1.8.0_121
```

# todo

x genymotion+ui explorer
x add toggle listview to gridview
x add vector icons to project - toggle grid/list
newest audio should go in to the top left
newest audio should show animation (fade in, rest shift right)
add delete, list view - swipe left
add redux / refactor
edit - add rename
edit - change icon
play - highlight box/row on mouseover
play - highlight box/row onPressDown
play - highlight the box/row during playing
add unit tests via jest
add flow check vscode
add persistence
minimize apk size
work on ios

add gps support to indicate location where recorded
add payment support to buy 
