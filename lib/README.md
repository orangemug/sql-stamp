# compiler
The compiler is split into 3 steps

 1. [tokenize](tokenize)
   * Turn the raw template into tokens
 2. [parse](parse)
   * Check the tokens and do any work we can ahead of time
 3. [evaluate](evaluate)
   * Produce the final output

Steps 1 & 2 can happen ahead of time, step 3 occurs when you pass the arguments to the compiled function.


