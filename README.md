# vscode-floskell

Format Haskell code with [floskell](https://github.com/ennocramer/floskell) in Visual Studio Code.

# Important

This extension has not been published to the Visual Studio Marketplace, I run it by copying the source to the local extensions folder. This was purely a learning excercise for me. Having said that, this extension is feature complete.

# Features 

This extension uses [floskell](https://github.com/ennocramer/floskell) to format Haskell source code. 

* To format a full-page document, open the command palette and choose "Format Document".
* To format a selection, select some text, open the command palette, and choose "Format Selection".
* To format on save, open User Preferences (⌘ , or Ctrl ,), then add: `"editor.formatOnSave": true` 

# Requirements

* [Stack](http://haskellstack.org) must be in `$PATH`.
* [floskell](https://github.com/ennocramer/floskell) must be available in the current stack project.

To add [floskell](https://github.com/ennocramer/floskell) to a stack project run `stack build floskell` (`build`, _not_ `install`!) in the stack project.

# Configuration

`floskell` can be configured via a `floskell.json` [configuration file](https://github.com/ennocramer/floskell#customization) in the root directory of your workspace. 

