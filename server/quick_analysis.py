#!/usr/bin/env python3
"""
Sacred Trinity Quick Analysis & Optimization Tool
Comprehensive architecture analysis for the Quantum Resonance Lattice
"""

import json
from pathlib import Path
from datetime import datetime


class QuickSacredTrinityAnalyzer:
    """Analyze Sacred Trinity (FastAPI + Flask + Gradio) architecture health"""
    
    def __init__(self, workspace_root: Path = None):
        """Initialize analyzer with workspace root"""
        self.workspace_root = workspace_root or Path(__file__).parent.parent
        self.analysis_results = {}
    
    def analyze_architecture(self):
        """Run comprehensive architecture analysis"""
        print("\n🌌 Starting Sacred Trinity Architecture Analysis...")
        print("="*60)
        
        # Analyze components
        components = self._analyze_components()
        
        # Analyze configuration
        configuration = self._analyze_configuration()
        
        # Analyze frontend
        frontend = self._analyze_frontend()
        
        # Analyze dependencies
        dependencies = self._analyze_dependencies()
        
        # Calculate overall score
        overall_score = self._calculate_overall_score(components, configuration, frontend, dependencies)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(components, configuration, frontend, dependencies)
        
        # Store results
        self.analysis_results = {
            "timestamp": datetime.now().isoformat(),
            "architecture_analysis": {
                "components": components,
                "configuration": configuration,
                "frontend": frontend,
                "dependencies": dependencies
            },
            "overall_score": overall_score,
            "recommendations": recommendations
        }
        
        return self.analysis_results
    
    def _analyze_components(self):
        """Analyze Sacred Trinity components"""
        print("\n🧠 Analyzing Sacred Trinity Components...")
        
        components = {
            "fastapi": {
                "file": "server/main.py",
                "status": "❌",
                "features": [],
                "completeness": 0
            },
            "flask": {
                "file": "server/app.py",
                "status": "❌",
                "features": [],
                "completeness": 0
            },
            "gradio": {
                "file": "server/canticle_interface.py",
                "status": "❌",
                "features": [],
                "completeness": 0
            }
        }
        
        # Analyze FastAPI (main.py)
        fastapi_file = self.workspace_root / "server" / "main.py"
        if fastapi_file.exists():
            content = fastapi_file.read_text()
            components["fastapi"]["status"] = "✅"
            
            # Check key FastAPI features
            fastapi_features = [
                ("FastAPI app creation", "FastAPI(" in content),
                ("WebSocket support", "/ws/" in content or "WebSocket" in content),
                ("Supabase integration", "supabase" in content.lower()),
                ("JWT authentication", "jwt" in content.lower() or "auth" in content.lower()),
                ("CORS middleware", "cors" in content.lower())
            ]
            
            for feature_name, has_feature in fastapi_features:
                if has_feature:
                    components["fastapi"]["features"].append(feature_name)
            
            components["fastapi"]["completeness"] = len(components["fastapi"]["features"]) / len(fastapi_features)
        
        # Analyze Flask (app.py) 
        flask_file = self.workspace_root / "server" / "app.py"
        if flask_file.exists():
            content = flask_file.read_text()
            components["flask"]["status"] = "✅"
            
            # Check key Flask features
            flask_features = [
                ("Flask app creation", "Flask(" in content),
                ("Dashboard routes", "/dashboard" in content or "/resonance" in content),
                ("CORS support", "cors" in content.lower()),
                ("Quantum engine", "quantum" in content.lower()),
                ("Template rendering", "render_template" in content)
            ]
            
            for feature_name, has_feature in flask_features:
                if has_feature:
                    components["flask"]["features"].append(feature_name)
            
            components["flask"]["completeness"] = len(components["flask"]["features"]) / len(flask_features)
        
        # Analyze Gradio (canticle_interface.py)
        gradio_file = self.workspace_root / "server" / "canticle_interface.py" 
        if gradio_file.exists():
            content = gradio_file.read_text()
            components["gradio"]["status"] = "✅"
            
            # Check key Gradio features
            gradio_features = [
                ("Gradio interface", "gradio" in content.lower() or "gr." in content),
                ("Ethical audit function", "ethical" in content.lower()),
                ("Interface launch", "launch" in content.lower()),
                ("Audit processing", "audit" in content.lower()),
                ("Coherence scoring", "coherence" in content.lower())
            ]
            
            for feature_name, has_feature in gradio_features:
                if has_feature:
                    components["gradio"]["features"].append(feature_name)
            
            components["gradio"]["completeness"] = len(components["gradio"]["features"]) / len(gradio_features)
        
        print(f"   FastAPI: {components['fastapi']['status']} ({len(components['fastapi']['features'])} features)")
        print(f"   Flask: {components['flask']['status']} ({len(components['flask']['features'])} features)")
        print(f"   Gradio: {components['gradio']['status']} ({len(components['gradio']['features'])} features)")
        
        return components
    
    def _analyze_configuration(self):
        """Analyze configuration files and deployment setup"""
        print("\n⚙️ Analyzing Configuration...")
        
        config = {
            "dockerfile": {"status": "❌", "optimized": False},
            "railway_config": {"status": "❌", "optimized": False}, 
            "requirements": {"status": "❌", "dependencies_count": 0},
            "env_template": {"status": "❌", "has_supabase": False}
        }
        
        # Check Dockerfile
        dockerfile = self.workspace_root / "Dockerfile"
        if dockerfile.exists():
            content = dockerfile.read_text()
            config["dockerfile"]["status"] = "✅"
            config["dockerfile"]["optimized"] = "python:3.11-slim" in content and "COPY server/" in content
        
        # Check Railway configuration
        railway_config = self.workspace_root / "railway.toml"
        if railway_config.exists():
            content = railway_config.read_text()
            config["railway_config"]["status"] = "✅"
            config["railway_config"]["optimized"] = "DOCKERFILE" in content
        
        # Check requirements.txt
        requirements_file = self.workspace_root / "server" / "requirements.txt"
        if requirements_file.exists():
            content = requirements_file.read_text()
            config["requirements"]["status"] = "✅"
            config["requirements"]["dependencies_count"] = len([line for line in content.splitlines() if line.strip() and not line.startswith("#")])
        
        # Check for .env template
        env_files = [self.workspace_root / ".env", self.workspace_root / ".env.template", self.workspace_root / "README.md"]
        for env_file in env_files:
            if env_file.exists() and "SUPABASE" in env_file.read_text():
                config["env_template"]["status"] = "✅"
                config["env_template"]["has_supabase"] = True
                break
        
        print(f"   Dockerfile: {config['dockerfile']['status']}")
        print(f"   Railway Config: {config['railway_config']['status']}")
        print(f"   Requirements: {config['requirements']['status']} ({config['requirements']['dependencies_count']} dependencies)")
        print(f"   Environment: {config['env_template']['status']}")
        
        return config
    
    def _analyze_frontend(self):
        """Analyze frontend integration"""
        print("\n🎨 Analyzing Frontend Integration...")
        
        frontend = {
            "html_files": {"count": 0, "status": "❌"},
            "pi_integration": {"status": "❌", "features": []},
            "resonance_viz": {"status": "❌", "svg_support": False}
        }
        
        frontend_dir = self.workspace_root / "frontend"
        if frontend_dir.exists():
            html_files = list(frontend_dir.glob("*.html"))
            frontend["html_files"]["count"] = len(html_files)
            frontend["html_files"]["status"] = "✅" if html_files else "❌"
            
            # Check Pi integration
            pi_integration_file = frontend_dir / "pi-forge-integration.js"
            if pi_integration_file.exists():
                content = pi_integration_file.read_text()
                frontend["pi_integration"]["status"] = "✅"
                
                pi_features = [
                    ("Pi Network SDK", "Pi." in content),
                    ("Payment processing", "createPayment" in content),
                    ("SVG visualization", "SVG" in content or "svg" in content),
                    ("Resonance rendering", "resonance" in content.lower()),
                    ("WebSocket integration", "websocket" in content.lower())
                ]
                
                for feature_name, has_feature in pi_features:
                    if has_feature:
                        frontend["pi_integration"]["features"].append(feature_name)
            
            # Check for SVG/visualization support
            for html_file in html_files:
                content = html_file.read_text()
                if "svg" in content.lower() or "visualization" in content.lower():
                    frontend["resonance_viz"]["status"] = "✅"
                    frontend["resonance_viz"]["svg_support"] = True
                    break
        
        print(f"   HTML Files: {frontend['html_files']['status']} ({frontend['html_files']['count']} files)")
        print(f"   Pi Integration: {frontend['pi_integration']['status']} ({len(frontend['pi_integration']['features'])} features)")
        print(f"   Resonance Viz: {frontend['resonance_viz']['status']}")
        
        return frontend
    
    def _analyze_dependencies(self):
        """Analyze dependencies and evaluation framework"""
        print("\n📦 Analyzing Dependencies and Evaluation...")
        
        dependencies = {
            "evaluation_system": {"status": "❌", "azure_ai": False},
            "agent_runner": {"status": "❌", "async_support": False},
            "tracing_system": {"status": "❌", "observability": False}
        }
        
        # Check evaluation system
        eval_file = self.workspace_root / "server" / "evaluation_system.py"
        if eval_file.exists():
            content = eval_file.read_text()
            dependencies["evaluation_system"]["status"] = "✅"
            dependencies["evaluation_system"]["azure_ai"] = "azure-ai-evaluation" in content
        
        # Check agent runner
        runner_file = self.workspace_root / "server" / "quantum_agent_runner.py"
        if runner_file.exists():
            content = runner_file.read_text()
            dependencies["agent_runner"]["status"] = "✅"
            dependencies["agent_runner"]["async_support"] = "async" in content
        
        # Check tracing system
        tracing_file = self.workspace_root / "server" / "tracing_system.py"
        if tracing_file.exists():
            dependencies["tracing_system"]["status"] = "✅"
            dependencies["tracing_system"]["observability"] = "trace" in tracing_file.read_text().lower()
        
        print(f"   Evaluation System: {dependencies['evaluation_system']['status']}")
        print(f"   Agent Runner: {dependencies['agent_runner']['status']}")
        print(f"   Tracing System: {dependencies['tracing_system']['status']}")
        
        return dependencies
    
    def _calculate_overall_score(self, components, configuration, frontend, dependencies):
        """Calculate overall architecture score"""
        scores = []
        
        # Component scores (40% weight)
        component_completeness = [
            components["fastapi"]["completeness"],
            components["flask"]["completeness"],
            components["gradio"]["completeness"]
        ]
        component_score = sum(component_completeness) / len(component_completeness)
        scores.append(component_score * 0.4)
        
        # Configuration score (25% weight)
        config_items = [config for config in configuration.values()]
        config_score = sum(1 for item in config_items if item["status"] == "✅") / len(config_items)
        scores.append(config_score * 0.25)
        
        # Frontend score (20% weight)
        frontend_score = (
            (1 if frontend["html_files"]["status"] == "✅" else 0) +
            (1 if frontend["pi_integration"]["status"] == "✅" else 0) +
            (1 if frontend["resonance_viz"]["status"] == "✅" else 0)
        ) / 3
        scores.append(frontend_score * 0.2)
        
        # Dependencies score (15% weight)
        deps_score = sum(1 for dep in dependencies.values() if dep["status"] == "✅") / len(dependencies)
        scores.append(deps_score * 0.15)
        
        overall = sum(scores)
        return {
            "overall_score": overall,
            "overall_percentage": round(overall * 100, 1),
            "component_score": component_score,
            "config_score": config_score, 
            "frontend_score": frontend_score,
            "dependencies_score": deps_score,
            "rating": self._get_rating(overall)
        }
    
    def _get_rating(self, score):
        """Get performance rating based on score"""
        if score >= 0.9:
            return {"level": "Transcendent", "emoji": "🌟", "description": "Sacred Trinity achieving perfect quantum harmony"}
        elif score >= 0.75:
            return {"level": "Harmonic", "emoji": "✨", "description": "Sacred Trinity maintaining excellent resonance"}
        elif score >= 0.6:
            return {"level": "Growing", "emoji": "🌱", "description": "Sacred Trinity building strong foundations"}
        elif score >= 0.4:
            return {"level": "Foundation", "emoji": "🔧", "description": "Sacred Trinity requires optimization"}
        else:
            return {"level": "Initiation", "emoji": "⚡", "description": "Sacred Trinity needs significant development"}
    
    def _generate_recommendations(self, components, configuration, frontend, dependencies):
        """Generate optimization recommendations"""
        recommendations = []
        
        # Component recommendations
        for comp_name, comp_data in components.items():
            if comp_data["status"] == "❌":
                recommendations.append(f"🔧 {comp_name.title()} component missing - create {comp_data['file']}")
            elif comp_data["completeness"] < 0.8:
                recommendations.append(f"⚡ {comp_name.title()} component needs enhancement - add missing features")
        
        # Configuration recommendations
        if configuration["dockerfile"]["status"] == "❌":
            recommendations.append("🐳 Add Dockerfile for containerized deployment")
        elif not configuration["dockerfile"]["optimized"]:
            recommendations.append("🐳 Optimize Dockerfile for multi-stage builds and slim images")
        
        if configuration["railway_config"]["status"] == "❌":
            recommendations.append("🚂 Add railway.toml for Railway deployment configuration")
        
        if configuration["requirements"]["dependencies_count"] < 10:
            recommendations.append("📦 Consider adding more dependencies for comprehensive functionality")
        
        if not configuration["env_template"]["has_supabase"]:
            recommendations.append("🔑 Add Supabase environment configuration template")
        
        # Frontend recommendations
        if frontend["html_files"]["count"] == 0:
            recommendations.append("🎨 Create frontend HTML interfaces for user interaction")
        
        if frontend["pi_integration"]["status"] == "❌":
            recommendations.append("💰 Implement Pi Network integration for payment processing")
        
        if not frontend["resonance_viz"]["svg_support"]:
            recommendations.append("🌈 Add SVG visualization support for quantum resonance")
        
        # Dependencies recommendations
        if dependencies["evaluation_system"]["status"] == "❌":
            recommendations.append("📊 Implement evaluation system for performance monitoring")
        
        if dependencies["agent_runner"]["status"] == "❌":
            recommendations.append("🤖 Create agent runner for automated testing and response collection")
        
        if dependencies["tracing_system"]["status"] == "❌":
            recommendations.append("🔍 Add tracing system for observability and debugging")
        
        # Add positive reinforcement if doing well
        overall_score = self._calculate_overall_score(components, configuration, frontend, dependencies)["overall_score"]
        if overall_score >= 0.8:
            recommendations.insert(0, "🌟 Sacred Trinity demonstrating excellent architecture - continue optimization")
        elif overall_score >= 0.6:
            recommendations.insert(0, "✨ Sacred Trinity showing strong foundation - focus on enhancement areas")
        
        return recommendations
    
    def print_report(self):
        """Print comprehensive analysis report"""
        results = self.analysis_results
        
        print("\n" + "="*60)
        print("🌌 SACRED TRINITY ARCHITECTURE ANALYSIS REPORT")
        print("="*60)
        
        # Overall score
        score_data = results["overall_score"]
        rating = score_data["rating"]
        
        print(f"\n🎯 OVERALL PERFORMANCE: {score_data['overall_percentage']}%")
        print(f"   {rating['emoji']} Rating: {rating['level']}")
        print(f"   {rating['description']}")
        
        # Detailed scores
        print(f"\n📊 DETAILED SCORES:")
        print(f"   🧠 Components: {round(score_data['component_score'] * 100, 1)}%")
        print(f"   ⚙️ Configuration: {round(score_data['config_score'] * 100, 1)}%")
        print(f"   🎨 Frontend: {round(score_data['frontend_score'] * 100, 1)}%")
        print(f"   📦 Dependencies: {round(score_data['dependencies_score'] * 100, 1)}%")
        
        # Component status
        print(f"\n🧠 SACRED TRINITY COMPONENTS:")
        components = results["architecture_analysis"]["components"]
        for comp_name, comp_data in components.items():
            print(f"   {comp_name.title()}: {comp_data['status']} ({len(comp_data['features'])} features)")
        
        # Recommendations
        recommendations = results["recommendations"]
        if recommendations:
            print(f"\n🔧 OPTIMIZATION RECOMMENDATIONS:")
            for i, rec in enumerate(recommendations[:8], 1):  # Show top 8
                print(f"   {i}. {rec}")
        
        print(f"\n📄 Analysis completed at: {results['timestamp']}")
        print("✅ Sacred Trinity analysis complete!")
    
    def save_report(self, filename="sacred_trinity_analysis.json"):
        """Save analysis report to JSON file"""
        with open(filename, 'w') as f:
            json.dump(self.analysis_results, f, indent=2)
        print(f"\n💾 Analysis report saved to: {filename}")
        return filename


def main():
    """Main analysis function"""
    print("🌌 Sacred Trinity Quick Analysis & Optimization Tool")
    print("🎯 Analyzing Quantum Resonance Lattice Architecture...\n")
    
    # Initialize analyzer
    analyzer = QuickSacredTrinityAnalyzer()
    
    # Run analysis
    results = analyzer.analyze_architecture()
    
    # Print comprehensive report
    analyzer.print_report()
    
    # Save report
    report_file = analyzer.save_report()
    
    return results


if __name__ == "__main__":
    main()
