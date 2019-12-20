# YAAMUTE

## Overview

Yet another auto mute extension.

Why? Because I want a minimal extension that only do one thing, auto mute the selected domains no regex or any other fancy stuff... and just for fun. ;)

To add a site right-click in the tab and select "Add to auto mute blacklist", the extension store the selected tab hostname (with the subdomain). If you want to add multiple subdomains open the pages and add them one by one (yep, it is painful :P)

To remove sites go to Add-ons (Ctrl+Shift+A) open YAAMUTE preferences and click the remove button.

#### Permissions:
- tabs (***Access browser tabs***) - watch URL changes
- storage - store the settings
- menus - create context menu item

## Install

### Add-on

Get the add-on from Mozilla [AMO Page](https://addons.mozilla.org/en-US/firefox/addon/yaamute/)

## Deployment

Create zip

```
$ zip -r -FS yaamute.zip manifest.json src
```