.PHONY: docs
.DEFAULT_GOAL := help

define BROWSER_PYSCRIPT
import os, webbrowser, sys

try:
	from urllib import pathname2url
except:
	from urllib.request import pathname2url

webbrowser.open(os.path.abspath(sys.argv[1]))
endef
export BROWSER_PYSCRIPT

BROWSER := python -c "$$BROWSER_PYSCRIPT"

test:
	pytest --cov=mongodb_viz

docs: ## generate Sphinx HTML documentation, including API docs
	rm -rf docs/source/api
	sphinx-apidoc -f -o docs/source/api mongodb_viz
	$(MAKE) -C docs clean
	$(MAKE) -C docs html
	$(BROWSER) docs/build/html/index.html
