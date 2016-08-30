+++
title = "Zeromutarts CTF Crypto Challenges"
date = "2014-01-27T15:08:00"
tags = ["writeups", "zeromutarts", "CTF", "crypto"]
math = true
+++

## The magic of rsa (100) 

    You were able to hear some whispering on the last crypto party!
    *whisper* $d$ is 35181901. Keep it secret or we are doomed!


We were given 2 files for the challenge.

### 1) rsa.py

```python
    #!/usr/bin/env python
    import sys
    n= 65354147
    e = 13
    d = ??

    f = open( sys.argv[1] , "r" )
        for line in f: 
        line = int(line.strip())
        # you'll have to insert the decrypt function for each line(number) here!
        #dec = ...
        print chr(dec)
```

### 2) rsa.txt
```text
    32588732
    56947340
    16730166
    16529146
    17037091
    9958499
    18895626
    49410873
    58063242
    16529146
    18895626
    30273022
    58063242
    30273022
    60194095
    9956852
    58063242
    44337129
    16730166
    5059543
    40999214
    39158796
    5059543
    58063242
    54302449
    9958499
    58063242
    8646641
    16730166
    51307370
    16730166
    57845836
    16730166
    34996934
    32762958
```

If you read up about [RSA decryption](https://en.wikipedia.org/wiki/RSA_%28cryptosystem%29#Decryption) on Wikipedia, it's pretty
simple and straightforward to solve this challenge. You need $C$ =
ciphertext (we got loads of it there in rsa.txt, just need to use one by
one), $d$ = private key exponent (we got that as well), $n$ = modulus for
both private and public keys. Thus, $M \equiv C^{d} \bmod n$

Here, I used [sagemath](https://cloud.sagemath.com) cloud application to solve it as follows. You could actually save the following into a python script and run it.

```python
    n = 65354147
    d = 35181901
    ctuple = [32588732,56947340,16730166,16529146,17037091,9958499,18895626,49410873,
    58063242,16529146,18895626,30273022,58063242,30273022,60194095,9956852,58063242,
    44337129,16730166,5059543,40999214,39158796,5059543,58063242,54302449,9958499,5806
    3242,8646641,16730166,51307370,16730166,57845836,16730166,34996934,32762958]
    result = ""

    for i in ctuple:
        lol = pow(i, d, n)
        result += chr(lol)
    print "Result for http://zeromutarts.de/task/rsa_magic : " + result
```

## rivest-shamir-adleman (250)

    *This one is important, we have no clue how to decrypt the secret message! Can you help us?*

We were given 2 files for this challenge as well.


### 1) rivest.py

```python
    #!/usr/bin/env python
    import sys
    n= 80646413
    e = 5

    # You'll have to find the d yourself..
    d = unknown

    f = open( sys.argv[1] , "r" )
    for line in f: 
        line = int(line.strip())
        # you'll have to insert the decrypt function for each line(number) here!
        #dec = ...
        print chr(dec)

    # might come handy
    def xgcd(a,b):
        """Extended GCD:
        Returns (gcd, x, y) where gcd is the greatest common divisor of a and b
        with the sign of b if b is nonzero, and with the sign of a if b is 0.
        The numbers x,y are such that gcd = ax+by."""
        prevx, x = 1, 0;  prevy, y = 0, 1
        while b:
            q, r = divmod(a,b)
            x, prevx = prevx - q*x, x
            y, prevy = prevy - q*y, y
            a, b = b, r
        return a, prevx, prevy

    def modinv(a, m):
        """Modular multiplicative inverse, i.e. a^-1 = 1 (mod m)"""
        a, u, v = xgcd(a, m)
        if a <> 1:
            raise Exception('No inverse: %d (mod %d)' % (a, m))
        return u
```

### 2) rivest.txt
```text
    72895864
    15633602
    38820479
    60303684
    7458706
    60299530
    20682371
    54642689
    26066811
    32615038
    35349196
    76400140
    38820479
    56463813
    80491201
    76400140
    35349196
    69567074
    26066811
    76400140
    74270178
    76127647
    76127647
    15633602
    76400140
    60303684
    38820479
    56463813
    60303684
    76400140
    72844764
    76127647
    69302434
    15633602
    80491201
    76400140
    6809712
    26066811
    76400140
    42498798
    60299530
    76127647
    69302434
    80491201
    33234011
```
This time we seriously need sagemath to solve it. :) Since we don't know the $d$ to decrypt the messages for this challenge, we first need to
find the $p$ & $q$ to get $d$. The most straightforward way to get that is to
use [Fermat's Factorization method](https://en.wikipedia.org/wiki/Fermat%27s_factorization_method).

I used the formula from here: http://facthacks.cr.yp.to/fermat.html to
get $p$ & $q$.

```python
    n = 80646413
    e = 5
    ctuple = [72895864,15633602,38820479,60303684,7458706,60299530,20682371,54642689,
    26066811,32615038,35349196,76400140,38820479,56463813,80491201,76400140,35349196,
    69567074,26066811,76400140,74270178,76127647,76127647,15633602,76400140,60303684,
    38820479,56463813,60303684,76400140,72844764,76127647,69302434,15633602,80491201,
    76400140,6809712,26066811,76400140,42498798,60299530,76127647,69302434,80491201,
    33234011]
    def fermatfactor(N):
       if N <= 0: return [N]
       if is_even(N): return [2,N/2]
       a = ceil(sqrt(N))
       while not is_square(a^2-N):
         a = a + 1
       b = sqrt(a^2-N)
       return [a - b,a + b]
    p, q = fermatfactor(n)

    phi=(p-1)*(q-1)
    d=pow(e,-1,phi)

    result = ""
    for i in ctuple:
        lol=pow(i,d,n)
        result+=chr(lol)
    print "Result for result http://zeromutarts.de/task/rivest-shamir-adleman : " + result
```
