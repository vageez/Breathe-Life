Whats happening here?

Creating an async stream to read the initial CSV. 
Converting CSV to JSON objects line by line.
Then finally processing JSON object and applying business rules.

index.js contains the async stream transfer and creation of output file.  
rulesConfig.js represents insurance company rules.  
businessRules.js represents business logic and application of rules against the data.  

### Run the program

npm i  
npm run start  

Results in an output.json file.
