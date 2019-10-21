# Developer Test

* 3 test questions. No restriction on language. Submit source code with instructions
how to execute it, test code, time and memory complexity analysis. *

## Question 1. Data Store and Load
A program uses an array ! of map(dictionary). The keys and values of each
map(dictionary) are both strings. In different languages, the corresponding type of map
is: PHP array, Java HashMap, C++ std::map, Objective-C NSDictionary, Swift Dictionary,
Python dict, JavaScript object, etc. For example:
```
a[0]["key1"]="value1" a[0]["key2"]="value2" a[1]["keyA"]="valueA" ...
```
In order to store and load array !, we use a string-based format where each line
corresponds to each element of array !:
text="key1=value1;key2=value2\nkeyA=valueA\n..."
Please implement a store function and a load function.
```
text=store(a); //store ! in a string-type variable "#$" a=load(text); //load array ! from
variable "#$"
```
You must follow the format:
key/value pairs are separated by '=' and ';' key/value may contain any character
items are separated by '\n’.

### Solution: 
Requirements: nodejs (https://nodejs.org/en/download/)

For store() function: use simple string concatenation for each iteration in the Map object

For load() function: use simple string split for the input and update (set) the Map object with the corresponding key

### Testing: 
```
> node run-store-n-load.js
```
*Result:*
```
Enter string based format then enter blank after the last line
(eg. key1=value1;key2=value2\nkeyA=valueA\nkeyC=valueC\n):
key1=abc;key2=def
keyA=ABC;keyZ=Zzzzz

Running load("key1=abc;key2=def\nkeyA=ABC;keyZ=Zzzzz")
Result:
[ Map { 'key1' => 'abc', 'key2' => 'def' },
  Map { 'keyA' => 'ABC', 'keyZ' => 'Zzzzz' } ]

Running store(
[object Map],[object Map]
)
Result:
key1=abc;key2=def
keyA=ABC;keyZ=Zzzzz
In string:
"key1=abc;key2=def\nkeyA=ABC;keyZ=Zzzzz"
```


## Question 2. Finding Optimal Path
Assume there is a directed acyclic graph, where every vertex has a positive weight. We
need to find a path such that the sum of the weights of all vertices on the path is
maximized.
Input: n vertices, m edges, origin vertex Output: sum of the optimal path
For example, 3 vertices with weights: 
```
A1
B2
C2
```
and 3 edges:
```
A->B
B->C
A->C
```
With origin vertex A, the output is 5, where optimal path is A → B → C with total weight 1 + 2 + 2 = 5.
Note: The assumption here is directed acyclic graph. What if the graph may not be
acyclic, how to avoid infinite loop caused by cycles?

### Solution: 
Requirements: nodejs (https://nodejs.org/en/download/)

Use a modified Djikstra algorithm to find the optimal path. 
*part 1:* 
* construct a hash table with each vertex as key, value contains weight, connection to other vertex, and solution (maxWeight and path)
* update the hash table with connection to all vertex
* put all vertex to an array of unvisited vertices

Time analysis: O(V + E)

*part 2:*
for each vertex starting from the origin vertex do: 
* for each connected vertices that is in unvisited vertices
  - check if there is a cyclic path by going tho this vertex by checking all the previous path
  - check if the total weight is larger that the current total weight, if so update with the new total weight and path

Time analysis: O(V + E)
for each vertex (V), only connected edges (E) to the vertex is checked, there is no edges is checked twice because of the construction of the hash table in part 1

*Cycle detection:* 
for every visit to a new vertex, check all the ancestor (previous path) if the vertex we currently visit is already in the ancestor (previous) list.


### Testing: 
Run three scenarios by running
```
node run-optimal-path.js
```
*Result:*
```
Scenario 1
Vertices: A1,B2,C2
Edges: A->B,B->C,A->C
Origin: A
Optimum path: A,B,C, with total weight: 5

Scenario 2
Vertices: B2,C10,D2,A1,E5
Edges: A->B,B->D,A->C,C->E,D->E
Origin: A
Optimum path: A,C,E, with total weight: 16

Scenario 3: Cyclic
Vertices: A2,B3,C2,D1,E5
Edges: A->B,B->C,C->D,D->E,D->B,A->D
Origin: A
Failed: Cycle detected, trying to add: D to path: A,D,B
```

*Note:* please modify file run-optimal-path.js to modify or run more scenarios.

## Question 3.
On a retail website, the following discounts apply:
1. If the user is an employee of the store, he gets a 30% discount
2. If the user is an affiliate of the store, he gets a 10% discount
3. If the user has been a customer for over 2 years, he gets a 5% discount.
4. For every $100 on the bill, there would be a $ 5 discount (e.g. for $ 990, you get $ 45
as a discount).
5. The percentage based discounts do not apply on groceries.
6. A user can get only one of the percentage based discounts on a bill.
Write a program with test cases such that given a bill, it finds the net payable amount.
Please note the stress is on object oriented approach and test coverage.
What we care about:
> object oriented programming approach
> test coverage
> code to be generic and simple
> leverage today's best coding practices

### Testing: 
Run three scenarios by running
```
node run-retail-discount.js
```


Getting Started
1. To start with, you can create one GitHub Repository and share it with us. While picking
a name for the repo do not include, name of the company, purpose or anything that might
potentially revel the nature of the repo, or you can share it as compressed file via email.
2. You can be in constant sync with the application's progress via the GitHub repository
and we can provide regular feedback, if required.
3. We request you to delete the repo after your final interview.

