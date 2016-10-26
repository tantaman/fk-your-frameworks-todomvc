# Fk Your Frameworks
## Fk Your Bloated Code

We've learned a lot.  We've learned to be declarative.  Now lets write
something with being declarative in mind.  Sad thing is that we could
have been writing javascript that was this simple since 1995.

Live demo: https://tantaman.github.io/fk-your-frameworks-todomvc/
142 sloc.

## Inspiration

All of these TodoMVC apps (http://todomvc.com/) are incredibly bloated.  The "vanilla" Javascript one (https://github.com/tastejs/todomvc/tree/gh-pages/examples/vanillajs) weighs in at 800 sloc!
I've also realised that even though we have React which lets us be declarative about our views, we're still not being declarative about our data.  This base app will be extended to cover "declarative state" and "declarative state transitions."

### Notes:
A visual sore in this implementation is event handling.  Problem is that we can't pass
the actual object that we care about updating to the event handlers.

Another thing to note (if you're a redux/elm/flux fan) are the direct data mutations.
I'm writing an article to address this problem shortly and describe how
we can make Elm and Redux messages/actions & reductions declarative.

I.e., instead of doing

  ```
  case COMPLETE_TODO:
    return state.map(todo =>
      todo.id === action.id ?
        { ...todo, completed: !todo.completed } :
        todo
    )
  ```

with a Redux reducer and action, you'll just do:

  ```
  askForMutation(`todo.completed = !todo.completed`);
  ```

The runtime will know exactly which parts of state need to be re-mapped & re-filtered
in order to preserve immutability, preserve history and perform an atomic
update of the state tree.

Final issue is inputs lose focus after "turning the crank."
