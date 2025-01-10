## Dropdowns

There are two dropdowns for the new items, selecting it's bill/category, and the menu. Both of these have to be
absolutely positioned since their elements can't be inside the same div that encloses the new items. The div that
encloses the new items has overflow css properties which would prevent the dropdowns from showing outside of the
div. When the dropdown buttons are clicked, the code grabs the position of the buttons and positions the dropdowns
there.

When it comes to closing the dropdowns properly, we also want to make sure that clicking on ANOTHER button just
repositions the dropdown instead of closing it. In order to do this, the button has aria attributes which specifies
the dropdown which it opens and closes. So all the ellipsis buttons and all of the bill/category buttons for the
new items technically open the same dropdown and have the same aria-controls attribute. This presents a problem
because then the hook (useCloseDropdown) that closes the dropdown wont close the dropdown when you click the button
on the new item which the dropdown is opened for. The hack for this, is to check the new position being passed
to the abs-pos-menu component and if it's the same, this means to close the button. If not, then it means to reposition
the component.
