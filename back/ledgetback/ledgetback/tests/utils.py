import time


def timeit(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        elapsed_time_ms = (end - start) * 1000
        print(
            'Time elapsed for {}: {:.4f} milliseconds'.format(
                func.__name__,
                elapsed_time_ms
            ))
        return result
    return wrapper
