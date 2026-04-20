.PHONY: test-canon validate-structure validate-schema semantic-lint

test-canon: validate-structure validate-schema semantic-lint
	@echo ""
	@echo "🎉 Gates 1–3 passed. Canon integrity enforced."

validate-structure:
	@echo "🔹 Gate 1: Structure"
	@bash .github/scripts/validate_structure.sh

validate-schema:
	@echo "🔹 Gate 2: Schema"
	@python3 .github/scripts/validate_schema.py

semantic-lint:
	@echo "🔹 Gate 3: Semantic"
	@python3 .github/scripts/semantic_lint.py
