# Fk Your Frameworks
## Fk Your Bloated Code

We've learned a lot.  We've learned to be declarative.  Now lets write
something with being declarative in mind.  Sad thing is that we could
have been writing javascript that was this simple since 1995.

Live demo: https://tantaman.github.io/fk-your-frameworks-todomvc/

### Caveats:
A hole in this implementation is event handling.  Problem is that we can't pass
the actual object that we care about updating to the event handlers.

Another problem (if you're a redux/elm/flux fan) are the direct data mutations.
I'm writing an article to address this problem shortly and describe how
we can make Redux and Elm actions & reductions declarative.

I.e., instead of doing

  ```
  case COMPLETE_TODO:
    return state.map(todo =>
      todo.id === action.id ?
        { ...todo, completed: !todo.completed } :
        todo
    )
  ```

with a Redux reducer and action, you'll do:

  ```
  askForMutation(`todo.complete = true`);
  ```

The runtime will know exactly which parts of state need to be re-mapped
in order to preserve immutability of state as well as perform an atomic update
of the state tree.

Final issue is inputs lose focus after "turning the crank."
