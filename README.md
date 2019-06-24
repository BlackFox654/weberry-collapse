#### Simple collapse plugin to show or hide your content with css transitions

# How to use

1. prepare HTML

        <button data-target="#collapse">Toggle</button>
        <div class="collapse" id="collapse">Lorem...</div>
2. prepare styles

        .collapse {
            overflow: hidden;
            display: none;
        }
        
        .collapse.is-collapsing {
            display: block;
            transition: height 300ms linear;
        }
        
        .collapse.is-collapsed {
            display: block;
            height: auto;
        }
        
3. ES6 Modules
 
        import WeberryCollapse from 'weberry-collapse';
        const collapse = new WeberryCollapse(document.getElementById('collapse'));
        
## Methods

### show 
Shows a collapsible element.

### hide
Hides a collapsible element.

### destroy
Destroy collapse.

## Options

### collapsingClass {String}
__default:__ 'is-collapsing'
  
### collapsedClass {String}
__default:__ 'is-collapsed'  
      
### toggleData {String}
__default:__ 'data-open' 

### openInitially {Boolean}
__default:__ false 
    
### clearHeightShown {Boolean}
__default:__ true 

### calcHeightShowFn {Boolean}

Custom function to calculate height of collapsed elem.

__default:__ null 
  
### handlerShow {Function}
Fires when the show method is started.

### handlerShown {Function}
Fires when the show method is finished.

### handlerHide {Function}
Fires when the hide method is started.

### handlerHidden {Function}
Fires when the hide method is finished.

### handlerBeforeShow {Function}
Fires before show method is started, waited permission to continue showing;
__default:__ () => return true;

### handlerBeforeHide {Boolean}
Fires before hide method is started, waited permission to continue hiding;
__default:__ () => return true;

### handlerDestroy
Fires after collapse instance is destroyed.