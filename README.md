# Developer Test

3 test questions. No restriction on language. Submit source code with instructions
how to execute it, test code, time and memory complexity analysis.

## Question 1. Data Store and Load
A program uses an array ! of map(dictionary). The keys and values of each
map(dictionary) are both strings. In different languages, the corresponding type of map
is: PHP array, Java HashMap, C++ std::map, Objective-C NSDictionary, Swift Dictionary,
Python dict, JavaScript object, etc. For example:
a[0]["key1"]="value1" a[0]["key2"]="value2" a[1]["keyA"]="valueA" ...
In order to store and load array !, we use a string-based format where each line
corresponds to each element of array !:
text="key1=value1;key2=value2\nkeyA=valueA\n..."
Please implement a store function and a load function.
text=store(a); //store ! in a string-type variable "#$" a=load(text); //load array ! from
variable "#$"
You must follow the format:
key/value pairs are separated by '=' and ';' key/value may contain any character
items are separated by '\n’.
———————————————————————————————————————
———————————————————————————————————————
————————————

## Question 2. Finding Optimal Path
Assume there is a directed acyclic graph, where every vertex has a positive weight. We
need to find a path such that the sum of the weights of all vertices on the path is
maximized.
Input: n vertices, m edges, origin vertex Output: sum of the optimal path
For example, 3 vertices with weights: A1
B2
C2
and 3 edges:
A->B
B->C
A->C
With origin vertex A, the output is 5, where optimal path is A → B → C with total weight 1
+ 2 + 2 = 5.
Note: The assumption here is directed acyclic graph. What if the graph may not be
acyclic, how to avoid infinite loop caused by cycles?
———————————————————————————————————————
———————————————————————————————————————
—————————————

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
Getting Started
1. To start with, you can create one GitHub Repository and share it with us. While picking
a name for the repo do not include, name of the company, purpose or anything that might
potentially revel the nature of the repo, or you can share it as compressed file via email.
2. You can be in constant sync with the application's progress via the GitHub repository
and we can provide regular feedback, if required.
3. We request you to delete the repo after your final interview.
