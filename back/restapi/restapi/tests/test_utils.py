from datetime import datetime
from django.test import TestCase

from restapi.utils import months_between


class TestUtils(TestCase):

    def test_months_between(self):
        test_cases = [
            [datetime(2020, 1, 1), datetime(2020, 1, 1), 0],
            [datetime(2020, 1, 1), datetime(2020, 1, 21), 0],
            [datetime(2020, 1, 1), datetime(2020, 2, 1), 1],
            [datetime(2020, 5, 1), datetime(2020, 8, 1), 3],
            [datetime(2020, 1, 1), datetime(2020, 12, 1), 11],
            [datetime(2020, 1, 1), datetime(2021, 1, 1), 12],
            [datetime(2020, 1, 1), datetime(2021, 2, 1), 13],
            [datetime(2020, 1, 1), datetime(2019, 1, 1), -12],
            [datetime(2020, 1, 1), datetime(2019, 12, 1), -1]
        ]

        for start, end, expected in test_cases:
            with self.subTest(start=start, end=end, expected=expected):
                self.assertEqual(months_between(start, end), expected)
