def foo():
    a = []
    b = "user"
    if a and foobar():
        foobar()
    else:
        print("foobar never gets executed")


def foobar():
    print("This code is executed")
    return True


foo()
