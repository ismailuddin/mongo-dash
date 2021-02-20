"""Tests for the data functions"""


import unittest
from pandas import util
from mongodb_viz.data import preprocess_data


class TestData(unittest.TestCase):
    def setUp(self):
        self.df = util.testing.makeDataFrame()

    def tearDown(self):
        self.df = None

    def test_preprocess_data(self):
        """Tests the `preprocess_data` function"""
        col_name = "fancy-col"
        df = preprocess_data(self.df, col_name)
        self.assertIn(col_name, df.columns)
