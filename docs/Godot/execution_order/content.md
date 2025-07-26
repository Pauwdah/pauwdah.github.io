# Execution Order

I was severly confused about the order of execution in Godot sometimes so I made this to help me remember. \
I tested all the written down information in Godot 4.4.1 \
I've split the Node Methods in 3 Phases to better visualize their life cycles.\
Further below I illustrated the [**SceenTree Flow**](#SceenTree_Flow).
\
I have not yet explored the virtual methods [``Node._shortcut_input``](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-private-method-shortcut-input) & [``Node._unhandled_key_input``](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-private-method-unhandled-key-input)

## Node Methods

### Phase 1 (Birth)

...happens **ONCE** when Node is *born*.

| **Order** | **Method / Callback**     | **When it's called**                                                     | **Godot Docs Source**                                                                                                              |
| --------- | ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | [`_init()`](#_init)                | Immediately when the object is constructed (GDScript only)               | [Object._init()](https://docs.godotengine.org/en/stable/classes/class_object.html#class-object-private-method-init) |
| 2         | [`_enter_tree()`](#_enter_tree)            | When the node is added to the SceneTree                                  | [Node._enter_tree()](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-private-method-enter-tree)                     |
| 3         | [`_ready()`](#_ready)                | After the node and all its children have entered the scene tree          | [Node._ready()](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-private-method-ready)                            |

### Phase 2 (Life)

...happens **WHILE** Node is alive.

| **Order** | **Method / Callback**     | **When it's called**                                                     | **Godot Docs Source**                                                                                                              |
| --------- | ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 4         | [`_input(event)`](#_input)           | Called when an InputEvent is received (before GUI and unhandled input)   | [Node._input()](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-private-method-input)                           |
| 5         | [`_unhandled_input(event)`](#_input) | Called for InputEvents not handled by GUI or `_input()`                  | [Node._unhandled_input()](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-private-method-unhandled-input)                                                                                                          |
| 6         | [`_physics_process(delta)`](#_process) | Called every physics frame (default: 60 FPS)                             | [Node._physics_process()](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-private-method-physics-process)                  |
| 7         | [`_process(delta)`](#_process)         | Called every rendered frame (as fast as possible depending on framerate) | [Node._process()](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-private-method-process)                                  |

### Phase 3 (Death)

..happens **ONCE** when node *dies*.

| **Order** | **Method / Callback**     | **When it's called**                                                     | **Godot Docs Source**                                                                                                              |
| --------- | ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 8         | [`_exit_tree()`](#_exit_tree)            | When the node is removed from the SceenTree. Added logic gets executed **before** Node is removed, which means it's properties can still be accessed from other Nodes in this process.                                | [Node._exit_tree()](https://docs.godotengine.org/en/stable/classes/class_node.html#class-node-private-method-exit-tree)                              |

<a id="SceenTree_Flow"></a>

## SceenTree Flow

In the following I'm trying to visualise the execution flow of the Nodes in the SceenTree. \
``'O' execution start point`` \

``'V/Ʌ' flow direction``

### Phase 1 (Birth) Explanation

<a id="_init"></a>

#### ``_init()`` Execution Order

Does not have a tree order since it's called before ``_enter_tree()``.

<a id="_enter_tree"></a>

#### ``_enter_tree()`` Execution Order

This order is pretty straight forward. \
Node logic is executed in hierarchical order from top to bottom as Nodes are added.

```md
# Tree          #Order  #Flow
Root            1       O
│                       │
├──Node 1       2       │
│  ├──Child 1   3       │
│  └──Child 2   4       │
└──Node 2       5       │
   └──Child 1   6       V
```

<a id="_ready"></a>

#### ``_ready()`` Execution Order

This order looks a bit wonky at first. \
But it makes more sense, if you think about a ``Node``, only *beeing able* to **be ready**, when all its ``children`` are ready too.

```md
# Tree                  #Order      #Flow
Root                    12               Ʌ
│                                        │
├──Node 1               7              ┌┐│
│  ├──Child 1           3            ┌┐│││          
│  │  ├Sub Child 1      1           O│││││       
│  │  └Sub Child 2      2           └┘││││      
│  └──Child 2           6             ││││         
│     ├Sub Child 1      4             ││││      
│     └Sub Child 2      5             └┘││      
└──Node 2               11              ││
   └──Child 1           10              ││
      ├Sub Child 1      8               ││
      └Sub Child 2      9               └┘
```

### Phase 2 (Life) Explaination

<a id="_process"></a>

#### ``_process()``, ``_physics_process()`` Execution Order

Both have, straight Top to Bottom Flow.

```md
# Tree          #Order  #Flow
Root            1       O
│                       │
├──Node 1       2       │
│  ├──Child 1   3       │
│  └──Child 2   4       │
└──Node 2       5       │
   └──Child 1   6       V
```

<a id="_input"></a>

#### ``_input()``, ``_unhandled_input()`` Execution Order

Both have, straight Bottom to Top Flow.

```md
# Tree          #Order  #Flow
Root            6       Ʌ
│                       │
├──Node 1       5       │
│  ├──Child 1   4       │
│  └──Child 2   3       │
└──Node 2       2       │
   └──Child 1   1       O
```

### Phase 3 (Death) Explaination

<a id="_exit_tree"></a>

### ``_exit_tree()`` Execution Order

Simlilair to ``_enter_tree()``, but reversed. \
Node logic is executed in hierarchical order from bottom to top.

```md
# Tree          #Order  #Flow
Root            6       Ʌ
│                       │
├──Node 1       5       │
│  ├──Child 1   4       │
│  └──Child 2   3       │
└──Node 2       2       │
   └──Child 1   1       O
```
