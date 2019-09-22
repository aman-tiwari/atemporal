# atemporal
I want a library I can use for making P2P games with Javascript in the browser, which transparently supports:
*  Conflict-resolution in state updates
*  Converging to trust-values for peers based on minimizing local-universal divergence
*  Efficiently pruning history for bad peers

Basically, the goal is to be able to make multiplayer games in javascript that are hard to cheat.
Note that, this problem is effectively impossible if you drop the possiblity of pruning history (and so state) by trust.
I'm not sure how you would prove a system is Byzantine-fault tolerant, so my experiments will only get to the "OK-in-practice" level.
If you look at this repository some weeks from its creation date, and it is empty, then I have failed in working on this side project :(.

## What currently exists:
Much work has been done by people who have read far more papers than me on parts of this topic:

* https://github.com/automerge/automerge
    * Easy to use, unsure how it would scale to realtime updates from multiple simulatenous peers
    * Would need some way to intelligently prune history to stop it growing unboundedly.

* https://gun.eco
    * Need to experiment
    
* http://archagon.net/blog/2018/03/24/data-laced-with-history
    * Need to experiment
 
It seems like what we want is a CRDT, with some ability to throw away the history after some number of trusted peers reach consensus (this can be done per-peer, and if a peer fails their computer will just slow from the memory pressure, and they might end up living in a fork). 

What I am hoping for is some randomized algorithm, that with high probability (i.e, `P(failure) ~ O(1/(num_peers ^ 2))`), prunes a CRDT to the maximal benefit of globally trusted peers. In effect, implementing: http://archagon.net/blog/2018/03/24/data-laced-with-history/#garbage-collection, with the baseline selection happening *locally* with convergence amongt *peers that trust each other*. This means you can fork the universe, but the peers you care about will come along with you.
I feel like the heuristics encoded within the way "time" works in this space could be interesting points in the games themselves.
