# seeds

React-native app that captures your song ideas at the moment of inspiration so 
you never forget a tune that you had in your head.

# dev tooling notes

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

x display edit | delete | share icons | back in tool bar
    
# FEATURE - edit 
edit action pressed - cancel the selectPanel and navigate to edit page
edit name - textfield
display created 
display duration
edit notes - text area
back button go back to list
play button to listen to recording on edit page
cancel and ok button

# PERSISTENCE
add persistence (redux middleware) - async - 
   recordings (no ui state - selected, isplaying, playprogress)
      refactor ui state into separate object under recordings
      filter out the mic state when saving

# FEATURE - delete
confirm delete of selected items

# add unit testing
add unit tests via jest

------------- PHASE ONE DONE --------------

# FEATURE - cache
keep the last played recordings cached, and history
new recordings also get loaded into cache
cache size is 50 recordings
if exceed max then release sound and drop from history, then add new sound
persist history and preload to cache on restore

why is GridView.willrecievepropupdate getting called everytime the getState on parent is called?

# FEATURE - grid display customization
simple view - name, if name empty display icon, if icon empty then nothing, fixed size sqaure grid items based on width of screen
detailed view - default (name, duration, created)
edit grid item - add vector icon or url image or browse local photo?

# FEATURE - import recordings
from url
from local file
from dropbox, baidu yun, google drive

# FEATURE - cancel playing

# UI fixes
anitmate add list and remove list - http://moduscreate.com/react-native-dynamic-animated-lists/
recording name ellipse if exceed 20 characters
progress bar should not changed size of the grid item
progress bar should align-self: flex-end
put the checkmark on the lower right

----------- PHASE TWO DONE -----------------

# FEATURE - share
display app picker and then send the wave file to that app

# data backup
where is it on the phone, how does user back it up, where does it go
user android's phone backup
backup to user's cloud storage (dropbox, google drive, baidu yun)
backup to own storage (REJECT)

# FEATURE - playlists (like albums)
    left side - pull out tab (default is all)
    under that is list of playlists (songs)
    can group recordings into playlists
    long press grid item - add to - list of playlists or 'Create...'

# UI enhancements
animation - newest audio should show animate in (http://stackoverflow.com/questions/31997126/animate-listview-items-when-they-are-added-removed-from-datasource)
icon - add icons to menu drop down
record - display audio meter when recording in modal
    http://developer.samsung.com/technical-doc/view.do;jsessionid=CD49A14903D73079243BF98A5567F7F0?v=T000000086
    http://stackoverflow.com/questions/14181449/android-detect-sound-level
    https://www.newventuresoftware.com/blog/record-play-and-visualize-raw-audio-data-in-android

# FEATURE - filter bar
search icon in the title bar
click search icon it expands to text field 
typing in text field does realtime filtering on grid
saves the text typed in as history 
history is displayed for user to select

# DEPLOY to android store
minimize apk size
publish to store
put up description

-------- PHASE 3 DONE --------------

# out of scope
record - adjust mic gain (http://stackoverflow.com/questions/25441166/how-to-adjust-microphone-sensitivity-while-recording-audio-in-android-solved)
record - display recording details (bit rate, sample rate)
record - long press (>1 s) will display cancel in non-modal
cancel - drag finger up, highlight cancel, let go will cancel

# research
immutable vs redux - can use together.  used in pepperoni framework together
https://www.npmjs.com/package/react-native-keyboard-spacer
native-base - more advanced components on top of react-native components
exponent - another layer on top of react-native
pepperoni - opinionated boilerplate for react-native 
mixins - https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html
why redux-loop, redux-thunk, redux-saga 
... http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34623840#34623840
... http://redux.js.org/docs/advanced/AsyncFlow.html

# archive
x genymotion+ui explorer
x add toggle listview to gridview
x add vector icons to project - toggle grid/list
X newest audio should go in to the top left
X record - display time in 00:00
x record - change record button to Icon.button
x record - tap once, will record and change to stop button
x layout - display timer in non-modal pop-up 
x layout - display icon for recording
x layout - record button on bottom
x record - display microphone icon in modal
x add menu icon move list/grid toggle to menu (http://cmichel.io/how-to-create-a-more-popup-menu-in-react-native/)

x grid layout 
   X smaller grid item
   X padding for content
   -X ess padding between items
   X duration + audio details in small text

x test scaling with lots of items
x record button is floating on top of everything
x add created (2s ago), display in grid under duration
x play should display play progress as a progress bar in grid item
x don't show progress bar if not playing
x remove the warning for indeterminate progress bar - https://github.com/facebook/react-native/pull/11791/commits/d336518bcbdb59128ec74f486953fce8750324ce
x grid layout needs to be tighter, less spaces
x grid item needs more padding inside
x error handling - if filepath doesn't exist don't RSOD, display toast - try catch on 248 when loading the sound file
x refactor - https://github.com/futurice/pepperoni-app-kit/blob/master/docs/ARCHITECTURE.md
x add redux - https://github.com/uiheros/react-native-redux-todo-list/blob/master/app/reducers/todos.js
            https://www.sitepoint.com/how-to-build-a-todo-app-using-react-redux-and-immutable-js/
            http://redux.js.org/docs/basics/ExampleTodoList.html
x refactor add using redux
x refactor startrecoring
x refactor playRecording / progressBar - isPlaying, playCurSecs
x refactor selecting recording based on long press   
x long press item to select grid item
x display green checkmark on all selected item
x why the stoprecording is not being dispatched properly - only affects emulator
x onPress on item will de-select
x multiple select

# reactions to react and javascript stack

built in timer causes lots of bugs if forget to cleanup before the component unmounts, use 
timermxin to auto cleanup but ES6 React doesn't support mixin, need to download another library react-mixin

library provides record support, but they took out play support because anothe library provides it
that library hasn't been updated for over a year, but there is a separate branch that is constantly being updated
will those changes go into master

uuid support, there is a node-uuid but this has been deprecated for uuid.  how are you suppose to know this?  
check the github pages, check the npm pages and compare last updated

conclusion - got to piece together many different libraries, finding the latest, most stable, ones that will be 
supported long term.  

