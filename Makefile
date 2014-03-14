.PHONY: test
test:
	prove -e node --ext .js t/
