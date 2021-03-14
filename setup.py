#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""The setup script."""

import os
from setuptools import find_packages
from setuptools import setup
import mongo_dash

this_directory = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(this_directory, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="mongo_dash",
    author="Ismail Uddin",
    version=mongo_dash.__version__,
    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
    ],
    description="Visualisation platform for MongoDB",
    install_requires=[
        "fastapi",
        "aiofiles",
        "jinja2",
        "uvicorn",
        "motor",
        "typer",
        "async-exit-stack",
        "async-generator"
    ],
    license="MIT license",
    long_description=long_description,
    long_description_content_type="text/markdown",
    include_package_data=True,
    entry_points={"console_scripts": ["mongo_dash=mongo_dash.cli:app"]},
    keywords="",
    packages=find_packages(exclude=("tests")),
    test_suite="tests",
    url="https://www.github.com/ismailuddin/mongo-dash",
    zip_safe=False,
)
