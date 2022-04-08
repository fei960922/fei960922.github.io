---
layout: post
title:  "Compiler 2015 --- Refinement Framework"
date:   2015-5-18 15:00:00
categories: Compiler
---


### Framework Refinement

TA provide a good framework in AST and IR, which is complete and standard. I found it hard to understand and a bit redundent. My framework is a compact one, which can provide basic function.


In AST, there are following class:

	- Others
		- BinaryOp
		- Decl
		- Pt
		- Program
		- Type
		- Type_struct
	- Node
		- Declaration
		- Funciton Definition
	- Stmt
		- Stmt_break
		- Stmt_comp
		- Stmt_continue
		- Stmt_Expr
		- Stmt_for
		- Stmt_if
		- Stmt_return
		- Stmt_while
	- Expr
		- Expr_array
		- Expr_cast
		- Expr_constant
		- Expr_func
		- Expr_identifier
		- Expr_init
		- Expr_postfix
		- Expr_symbol
		- Expr_type
		- Expr_unary
	- Symbol
		- Symbol_array
		- Symbol_func
		- Symbol_struct

In IR, there are following class:

	- Address
		- Ad_const
		- Ad_expr
		- Ad_func
		- Ad_label
		- Ad_load
		- Ad_temp
		- Ad_var
	- Function
	- Quad
		- Quad_define
		- Quad_expr
		- Quad_goto
		- Quad_if
		- Quad_label
		- Quad_param
		- Quad_return
		

Few refinement are made in the following:

1. File name

	There are few basic class (ie. **Stmt** , **Expr**, **Quad**), and most of the class is extended by them.

	All extended class is named as [extended class]_[Real name].

2. Compound similiar Class

	Many similiar are mixed up in my framework:

	- **AST** Struct & Union

		They are similiar except the size and visiting method.

	- **AST&IR** Int & Char

		They are the same in value and can be calculated together.

		Every Variable in my ast have a **type** which tells its type.

		**Expr_const** are the mixture of **CharConst** and **IntConst**.
		**Type** and **Decl** are the same.

	- **AST&IR** Operation

		All operations are mixed into **BinaryOp**. Include **UnaryOp**, **ArithmeticOp** and **RelationalOp**.

		Thus, **NOT** is added as an Operation in **BinaryOp**.

		PS: I notice that it won't be called **BinaryOp** but **Op** as well.

	- **IR** Struct & Array & memory read

		Array Symbol is an pointer as well. That are the same as memory read.

		PS: There are more different in Address class which will be discuss later.

	- **IR** **Iftrue** & **Iffalse**

		I have a function called "Reverse" in expression so that:

		**Iffalse expr goto #x** can be replaced by **If expr.Reverse() goto #x**

	- **IR** **Quad_expr**

		**Quad_expr** class include many kind of instruction:

			public Quad_expr(Address d, Address s1, Address s2, BinaryOp o) {
				// Standand Quadruple   $t = $a + $b 
			}
			public Quad_expr(Address d, Address s, BinaryOp o) {
				// Those need two address only.  eg. $t = $b; $t = $(a+10);
			}
			public Quad_expr(Address d, Address s) throws Exception {
				// Convert Ad_expr to Quad_expr with standand Form.
				// **Ad_expr** is a special **Address** which will be discuss later.
			}
			public Quad_expr(Address d) throws Exception {
				// Convert Ad_func to CALL Quad. eg. CALL func, 1.
				// In my framework, "CALL" function is a special **Address**
			}

3. Shrinking Codes

	In TA's framework, all class is written as follow:

		//Assign.java as an example
		public Address dest;
	    public Address src;
	    public Assign() {
	        dest = null;
	        src = null;
	    }
	    public Assign(Address dest, Address src) {
	        this.dest = dest;
	        this.src = src;
	    }

	I shrink it into follow:

		public Address dest = null;
	    public Address src  = null;
	    public Assign(Address d, Address s) {
	        dest = d;
	        src = s;
	    }

4. Safety assess and same function name

	- All variables which is not needed to be assessed have a "Private" property. (In java, a variable without "public" means it is "private").

	- **(AST)** Most of the classes have more than one construct function and have a function named "append".
	Most of the read and write is finished in these functions.

	- The function name is the same for same function in different class.

		All class in AST have these function :
		
		- print 	// Print AST 		(Phase1)
		- semantic	// Semantic Check	(Phase2)
		- translate	// Translate		(Phase3)

		All class in IR have these function :

		- toString 	// To output IR		(Phase3)
		- generate	// To output MIPS	(Phase4)

5. Other feature

	- **IR** Discussing **Address** ------ **Ad_expr** 

	It is a special Address extended class represent simple expr as an address.

	There are different use:

		- It exist in **Quad_if**

		eg. If a>b goto #x  //  a>b is an **Ad_expr**.

		- It is used to Optimize such code:

			//a = b + c
			ADD $t0 $b $c
			ASSIGN $a $t0
			->
			ADD $a $b $c

	When translating Expr (a = b + c), (b+c) is an Expr which is son of Expr(a = b + c).

	In usual way, two layer of Expr will translate to two IR code.

	When I translate Expr(b+c) it won't return a basic Address which may be an temp. address. I return an **Ad_expr** (b+c) instead. 
	
	This will be returned back to father Expr so that the father Expr's translation. It may have two address source **$a** and **b+c** and an Op.ASSIGN. A new **ADD $a $b $c** will be made.

	- **IR** Discussing **Address** ------ Renaming method

	As we all know, despite different naming space may have the same name of variable which represent different variable, variable should be renamed in translation.

	In my framework, I rename all variable whatever into an integer. Each variable have an own number which is made in symbol table (once a variable inserted into the symbol table, it will have a number.)

	That's why **Ad_var** and **Ad_temp** have only a single integer as well. 

More feature will be avaliable later. Good luck!

PS: This blog is part of the report for Compiler 2015.