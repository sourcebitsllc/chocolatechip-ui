#ChocolateChip - A Compact Framework for Mobile Web Apps

###ChocolateChip-UI has been acquired by [Sourcebits Inc](http://www.sourcebits.com).

##ChocolateChip-UI

ChocolateChip-UI is a framework for making mobile Web apps. It has three components: semantic HTML5 markup, CSS and JavaScript. To successfully make an app with ChocolateChip-UI you'll need at least moderate experience working with JavaScript. This is so you can use templates, make Ajax requests and handle callbacks for user interaction. If this is beyond your current skills, consider getting someone with Web development experience to help you. ChocolateChip-UI is built on jQuery, so you will need a compatible version of it to work with ChocolateChip-UI.

Please visit [ChocolateChip-UI's Website](http://chocolatechip-ui.com) for documentation and tutorials. This project includes examples for iOS, Android and Windows Phone 8 to help you get going.

##Building 

ChocolateChip-UI uses Gruntjs to build. This is a Node package, so you'll first need to have [Node installed](http://http://nodejs.org). After installing Nodejs, or if you already have it installed, on Mac OS X use the terminal to cd to the directory. On Windows you can use the Windows command prompt to do this. Once you are in the folder, run the following command in your terminal: 
    npm install -g grunt-cli

On Mac OS X, you'll need to run the command with **sudo** to avoid installation errors: 

    sudo npm install -g grunt-cli

Enter your password when it requests. After you should see a number of Nodejs modules being installed in a folder called **node\_modules**. You do not need **node\_modules** in your final project. The node modules are there to enable the build process with Gruntjs.

Now that you have the node modules install, you can just type `grunt` in the terminal and hit return/enter. This will kick off the build process, which will produce the following directories:


    chui/
    data/
    demo/
    examples-android/
    examples-ios/
    examples-win/
    images/
    node_modules/

 
 If you're starting a new project, you only need the files in the **chui** folder. If you want to create a custom build, then just run **npm install**, then any of the custom build patterns listed below.

By default the grunt script builds everything into the same directory as the repository. You can change this so that it builds to a project directory of your choice. Just update the value of projectPath in the package.json file. By default, the value is empty, so it builds into the same directory.  Possible values on a Mac are, assuming your username is 'joe':

    // Build the project in a folder called 'MyProject' on your desktop:
    projectPath: "/Users/joe/Desktop/MyProject/"

For Windows, you would do this:

    // Build the project in a folder called 'MyProject' on your desktop:
    projectPath: "C:\Users\joe\Desktop\MyProject\"

**Note** If your username is not "joe", the above examples will not work. Please change the word "joe" with the username you use on your computer.

If your development stack supports LESS, you can grab the LESS files in the **src/themes** folder to use directly. The colors for each theme are defined in **colors.less**. This makes it easy for you to modify the color scheme of the themes. The order that the files load to create a theme are defined in **main.less**. After modifying the LESS, you can regenerate new CSS as follows:


    // Run LESS on the iOS theme:
    grunt ios

    // Run LESS on the Android theme:
    grunt android

    // Run LESS on the Windows theme:
    grunt win

    // Runn LESS on all three themes:
    grunt themes


If you've modified ChUI.js to address a bug or one for a new widget, you can run JSHint against these files as follows:

    // Concat ChUI.js source files & run JSHint:
    grunt chuijs

If you create a new module, make sure you include it in the `concat:chui` task in the Gruntfile so that the build process compiles it into the final version of ChUI.js. Whenever you build ChUI.js, the script also runs JSHint against it, which will flag any coding errors or lapses in coding practices. If JSHint throws an error in the terminal, look for where it stopped and check for any errors in your code. Learn about [JSHint](http://www.jshint.com).

##Custom Builds

You may want to build a version of ChUI for a single platform. You can do this as follows:

    // Build ChUI for Android:
    grunt android_examples

    // Build ChUI for iOS:
    grunt ios_examples

    // Build ChUI for Windows Phone 8:
    grunt win_examples

##Watch Files

While editing your project, you may find yourself making changes to the LESS files to customize the branding. Or you way want to make changes to the examples to see what happens. You can use `grunt watch` to tell Grunt to regenerate the output each time you make a change to the source files. Here are your options:

    // Watch all files and regenerate 
    // them when you make changes:
    grunt watch

    // Watch only the LESS files:
    grunt watch:less

    // Watch only the ChUI.js source files:
    grunt watch:scripts

    // Watch the html source files:
    grunt watch:html

##Right-to-left Language Support

For languages that are right-to-left, such as Arabic, Farse, Urdu and Hebrew, ChocolateChip-UI provides full support. All you have to do is add the following to your document:

    &lt;html dir="rtl"&gt;

You can also add the appropriate lang attribute value for the language you are using. When ChocolateChip-UI see the dir="rtl" value on the HTML tag it automatically adjust the layouts and user interaction to suit the right-to-left format. This includes correct right-to-left navigation direction, reverse back buttons, etc.

You can also build out right-to-left examples from the source. Just run this in your terminal:

    grunt rtl

The folders with right-to-left examples for Android, iOS and Windows will be created.

###Note

You do not need Nodejs to use ChocolateChip-UI. Nodejs is only used to build the framework and examples from the source files.

##Contributing Code
###Avoiding Carriage Returns in Commits

ChocolateChip-UI uses Unix linefeeds (LF) for new lines. Github for Windows adds carriage returns to linefeeds (CRLF). If you try to check in such files, Git will flag every line with changed new lines, which means practically everything. To avoid this we've added a .gitattributes file to the repository. This will prevent Github from converting the new lines on Windows. 

If you are editing the source code on Windows, depending on the text editor you are using, or if you do a copy/paste, you may inadvertently introduce Windows carriage returns. Also some Grunt actions, such as concatenation with banners, automatically create newlines with carriage returns on Windows. When these carriage returns are added to the source code, they will show up as a changes at commit time. You can avoid this. Navigate to the ChocolateChip-UI repository in the command prompt, then execute these two Git commands:

    git config core.eol lf
    git config core.autocrlf input

core.eol tells Git to always checkout this repository with LF. 
core.autocrlf tells Git to convert CRLF to LF on commit.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/2f123684cf50f62013c044733bfc36fb "githalytics.com")](http://githalytics.com/sourcebitsllc/chocolatechip-ui)