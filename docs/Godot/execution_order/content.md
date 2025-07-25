# Execution Order

I was severly confused about the order of execution in godot sometimes so i made this to help me remember. \
I've split the Node Methods in 3 Phases for better clarity.

## Node Methods

### Phase 1

...happens ONCE in the beginning of Node life.

| **Order** | **Method / Callback**     | **When it's called**                                                     | **Documentation Source**                                                                                                              |
| --------- | ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | `_init()`                 | Immediately when the object is constructed (GDScript only)               | [GDScript lifecycle](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#class-constructor-init) |
| 2         | `_enter_tree()`           | When the node is added to the SceneTree                                  | [SceneTree signals](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-method-_enter-tree)                     |
| 3         | `_ready()`                | After the node and all its children have entered the scene tree          | [SceneTree ready](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-method-_ready)                            |

### Phase 2

...happens CONTINUOUSLY while Node alive.

| **Order** | **Method / Callback**     | **When it's called**                                                     | **Documentation Source**                                                                                                              |
| --------- | ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 4         | `_input(event)`           | Called when an InputEvent is received (before GUI and unhandled input)   | [Input event flow](https://docs.godotengine.org/en/stable/tutorials/inputs/inputevent.html#inputevent-flow)                           |
| 5         | `_unhandled_input(event)` | Called for InputEvents not handled by GUI or `_input()`                  | [Input event flow](https://docs.godotengine.org/en/stable/tutorials/inputs/inputevent.html#inputevent-flow)                                                                                                          |
| 6         | `_physics_process(delta)` | Called every physics frame (default: 60 FPS)                             | [Physics process](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-method-_physics-process)                  |
| 7         | `_process(delta)`         | Called every rendered frame (as fast as possible depending on framerate) | [Process](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-method-_process)                                  |

### Phase 3

..happens ONCE at the end of Node life.

| **Order** | **Method / Callback**     | **When it's called**                                                     | **Documentation Source**                                                                                                              |
| --------- | ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 8         | `_exit_tree()`            | When the node is removed from the SceneTree                              | [Exit tree](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-method-_exit-tree)                              |
| 9         | `queue_free()` / `free()` | Frees the node; destructor called after `_exit_tree()`                   | [Freeing nodes](https://docs.godotengine.org/en/stable/tutorials/scripting/freeing_nodes.html) |

## Tree Execution Order

In the following I'm trying to visualise the execution flow of the Nodes in the Tree. \
``'X' meaning Execution Start`` \
``'O' meaning Execution End``

### Phase 1 Explaination

#### ``_init()`` Execution Order

Does not have a tree order before ``_enter_tree()``.

#### ``_enter_tree()`` Execution Order

This order is pretty straight forward. \
Node logic is executed in hierarchical order from top to bottom.

```md
# Tree          #Order  #Flow
Root            1       X
│                       │
├──Node 1       2       │
│  ├──Child 1   3       │
│  └──Child 2   4       │
└──Node 2       5       │
   └──Child 1   6       O
```

#### ``_ready()`` Execution Order

This order looks a bit wonky at first. \
But it makes more sense, if you think about a ``Node``, only *beeing able* to **be ready**, when all its ``children`` are ready too.

```md
# Tree                  #Order      #Flow
Root                    12               O
│                                        │
├──Node 1               7              ┌┐│
│  ├──Child 1           3            ┌┐│││          
│  │  ├Sub Child 1      1           X│││││       
│  │  └Sub Child 2      2           └┘││││      
│  └──Child 2           6             ││││         
│     ├Sub Child 1      4             ││││      
│     └Sub Child 2      5             └┘││      
└──Node 2               11              ││
   └──Child 1           10              ││
      ├Sub Child 1      8               ││
      └Sub Child 2      9               └┘
```

### Phase 2 Explaination

[]()「」

### Phase 3 Explaination

### ``_exit_tree()`` Execution Order

Simlilair to ``_enter_tree()``, but reversed. \
Node logic is executed in hierarchical order from bottom to top.

```md
# Tree          #Order  #Flow
Root            6       O
│                       │
├──Node 1       5       │
│  ├──Child 1   4       │
│  └──Child 2   3       │
└──Node 2       2       │
   └──Child 1   1       X
```

### ``_queue_free()`` Execution Order

Does not have a tree order after ``_exit_tree()``.
