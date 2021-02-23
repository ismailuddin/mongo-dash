"""Functions for pre-processing data"""

import pandas as pd


def preprocess_data(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
    """Preprocesses dataset to add an additional column

    Args:
        df (pd.DataFrame): Input dataframe
        col_name (str): Column name

    Returns:
        pd.DataFrame: Modified dataframe.
    """
    df[col_name] = "data-col"
    return df
