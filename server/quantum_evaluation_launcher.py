#!/usr/bin/env python3
"""
🌌 Sacred Trinity Evaluation Launcher
Complete evaluation framework deployment for Quantum Resonance Lattice

Integrates:
- Azure AI Evaluation SDK with custom Sacred Trinity evaluators  
- Automated response collection from FastAPI:8000, Flask:5000, Gradio:7860
- Comprehensive evaluation metrics and reporting
- Sacred Trinity architecture optimization analysis
"""

import asyncio
import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

# Import tracing system
try:
    from tracing_system import get_tracing_system
    tracing_enabled = True
    tracing_system = get_tracing_system()
except ImportError:
    tracing_enabled = False
    tracing_system = None

# Import our Sacred Trinity evaluation components
from evaluation_system import QuantumLatticeEvaluator
from quantum_agent_runner import SacredTrinityAgentRunner

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SacredTrinityEvaluationSuite:
    """🎯 Complete evaluation suite for Quantum Resonance Lattice"""
    
    def __init__(self):
        self.evaluator = QuantumLatticeEvaluator()
        self.test_data = []
        self.collected_responses = []
        self.evaluation_results = {}
        self.optimization_recommendations = []
        
    async def run_complete_evaluation(self) -> Dict[str, Any]:
        """Execute complete Sacred Trinity evaluation pipeline"""
        if tracing_enabled and tracing_system:
            with tracing_system.create_quantum_span(
                tracing_system.get_tracer("evaluation-launcher"),
                "run_complete_evaluation",
                {"evaluation_suite": "sacred_trinity"}
            ) as span:
                return await self._run_complete_evaluation_impl()
        else:
            return await self._run_complete_evaluation_impl()

    async def _run_complete_evaluation_impl(self) -> Dict[str, Any]:
        logger.info("🌌 Initiating Complete Sacred Trinity Evaluation Suite...")
        
        try:
            # Step 1: Generate comprehensive test dataset
            logger.info("📝 Step 1: Generating Sacred Trinity test dataset...")
            self.test_data = self._generate_comprehensive_test_data()
            logger.info(f"✅ Generated {len(self.test_data)} test scenarios")
            
            # Step 2: Launch Sacred Trinity services health check
            logger.info("🔍 Step 2: Checking Sacred Trinity component health...")
            async with SacredTrinityAgentRunner() as agent_runner:
                health_status = await agent_runner.check_trinity_health()
                logger.info(f"🏥 Health Status: {health_status}")
                
                # Step 3: Collect responses from live Sacred Trinity
                logger.info("📡 Step 3: Collecting responses from Sacred Trinity components...")
                self.collected_responses = await agent_runner.run_comprehensive_collection(self.test_data)
                
                # Save collected responses dataset
                responses_file = await agent_runner.save_responses_dataset("sacred_trinity_responses.jsonl")
                logger.info(f"💾 Responses saved to: {responses_file}")
                
                # Get collection summary
                collection_summary = agent_runner.get_collection_summary()
            
            # Step 4: Prepare evaluation dataset
            logger.info("🔬 Step 4: Preparing evaluation dataset with collected responses...")
            evaluation_dataset_file = self._prepare_evaluation_dataset()
            
            # Step 5: Run Azure AI Evaluation
            logger.info("⚡ Step 5: Running Azure AI Evaluation with Sacred Trinity evaluators...")
            self.evaluation_results = await self._run_azure_evaluation(evaluation_dataset_file)
            
            # Step 6: Analyze results and generate optimization recommendations
            logger.info("🎯 Step 6: Analyzing results and generating optimization recommendations...")
            analysis = self._analyze_evaluation_results()
            
            # Step 7: Generate comprehensive report
            logger.info("📊 Step 7: Generating comprehensive evaluation report...")
            report = self._generate_comprehensive_report(health_status, collection_summary, analysis)
            
            # Save final report
            report_file = self._save_evaluation_report(report)
            logger.info(f"📄 Evaluation report saved to: {report_file}")
            
            logger.info("✅ Sacred Trinity Evaluation Suite Complete!")
            return report
            
        except Exception as e:
            logger.error(f"❌ Evaluation suite failed: {e}")
            return {"status": "failed", "error": str(e), "timestamp": datetime.utcnow().isoformat()}
    
    def _generate_comprehensive_test_data(self) -> List[Dict[str, Any]]:
        """Generate comprehensive test dataset for Sacred Trinity evaluation"""
        return [
            # FastAPI Quantum Conduit Tests
            {
                "query": "Test FastAPI quantum conduit health and JWT authentication with Supabase integration",
                "component": "fastapi",
                "endpoint": "/",
                "expected_response": "JWT authentication successful with quantum resonance session established and Supabase connection verified",
                "context": "FastAPI serves as the quantum conduit handling authentication, WebSocket streaming, and database operations",
                "quantum_phase": "foundation",
                "evaluation_focus": "authentication_security",
                "test_id": "trinity_fastapi_001",
                "sacred_trinity_context": True
            },
            {
                "query": "Verify WebSocket collective insight broadcast for real-time consciousness streaming across Sacred Trinity",
                "component": "fastapi",
                "endpoint": "/ws/collective-insight", 
                "expected_response": "WebSocket connection established successfully with real-time resonance state broadcasting and cross-component synchronization achieved",
                "context": "WebSocket consciousness streaming enables real-time quantum entanglement across FastAPI, Flask, and Gradio components",
                "quantum_phase": "growth",
                "evaluation_focus": "real_time_communication",
                "test_id": "trinity_websocket_001", 
                "sacred_trinity_context": True
            },
            {
                "query": "Test Supabase database operations with Row Level Security for ethical data integrity",
                "component": "fastapi",
                "endpoint": "/users/me",
                "expected_response": "Database operations completed successfully with RLS policies enforced and ethical data flow controls maintained",
                "context": "Supabase PostgreSQL integration provides ethical data management with Row Level Security for quantum data integrity",
                "quantum_phase": "harmony",
                "evaluation_focus": "data_integrity",
                "test_id": "trinity_database_001",
                "sacred_trinity_context": True
            },
            # Flask Glyph Weaver Tests
            {
                "query": "Evaluate Flask quantum resonance dashboard with archetype distributions and collective wisdom analytics",
                "component": "flask",
                "endpoint": "/resonance-dashboard",
                "expected_response": "Quantum resonance dashboard generated successfully with archetype distributions, collective wisdom metrics, and pioneer engagement analytics displayed",
                "context": "Flask serves as the glyph weaver transforming quantum data into visual symphonies and dashboard analytics",
                "quantum_phase": "foundation",
                "evaluation_focus": "visualization_accuracy",
                "test_id": "trinity_dashboard_001",
                "sacred_trinity_context": True
            },
            {
                "query": "Test Pi payment processing to 4-phase SVG cascade animation transformation pipeline",
                "component": "flask",
                "endpoint": "/resonate/payment_hash",
                "expected_response": "Payment processing completed: 4-phase SVG cascade animation rendered with Foundation→Growth→Harmony→Transcendence progression achieved",
                "context": "Payment-to-visualization pipeline transforms blockchain transactions into procedural SVG art representing quantum phases",
                "quantum_phase": "transcendence",
                "evaluation_focus": "artistic_transformation",
                "test_id": "trinity_payment_viz_001",
                "sacred_trinity_context": True
            },
            {
                "query": "Execute quantum cathedral deep layer processing with Veiled Vow manifestation protocols",
                "component": "flask",
                "endpoint": "/quantum/veiled-vow",
                "expected_response": "Quantum cathedral processing completed: Veiled Vow manifestation achieved with deep layer harmonic synthesis and archetypal resonance established",
                "context": "Advanced quantum engine processing implementing sacred protocols for consciousness evolution through digital alchemy",
                "quantum_phase": "transcendence",
                "evaluation_focus": "quantum_processing",
                "test_id": "trinity_quantum_cathedral_001",
                "sacred_trinity_context": True
            },
            # Gradio Truth Mirror Tests
            {
                "query": "Perform comprehensive ethical audit with Veto Triad synthesis and coherence scoring for AI decision validation",
                "component": "gradio",
                "endpoint": "/ethical-audit",
                "expected_response": "Ethical audit completed successfully: risk score < 0.05 achieved, Veto Triad synthesis calculated, coherence narrative generated with wisdom guidance provided",
                "context": "Gradio truth mirror provides ethical gatekeeping through Veto Triad synthesis, coherence scoring, and narrative wisdom generation",
                "quantum_phase": "harmony",
                "evaluation_focus": "ethical_processing",
                "test_id": "trinity_ethical_audit_001",
                "sacred_trinity_context": True
            },
            {
                "query": "Execute quantum branch simulation for what-if ethical scenarios with sovereign canticle analysis",
                "component": "gradio",
                "endpoint": "/quantum-branches",
                "expected_response": "Quantum branch simulation completed: multiple reality paths evaluated, ethical entropy calculated, sovereign canticle wisdom synthesized for decision guidance",
                "context": "Standalone model evaluation forking quantum realities to explore ethical implications of different decision paths",
                "quantum_phase": "transcendence",
                "evaluation_focus": "simulation_fidelity",
                "test_id": "trinity_quantum_branches_001",
                "sacred_trinity_context": True
            },
            {
                "query": "Process reactive echo and tender reflection for affirmation synthesis with ledger entry update",
                "component": "gradio",
                "endpoint": "/canticle/affirmation",
                "expected_response": "Reactive echo integrated successfully, tender reflection processed, affirmation synthesis achieved with updated ledger entry and emotional resonance harmonized",
                "context": "Canticle interface processes emotional resonance through reactive echo and tender reflection for ethical synthesis",
                "quantum_phase": "harmony",
                "evaluation_focus": "emotional_processing",
                "test_id": "trinity_emotional_synthesis_001",
                "sacred_trinity_context": True
            },
            # Cross-Component Integration Tests
            {
                "query": "Validate cross-Trinity JWT authentication flow and quantum entanglement synchronization",
                "component": "integration",
                "endpoint": "/trinity/auth-sync",
                "expected_response": "Cross-Trinity authentication synchronized: JWT tokens shared across FastAPI, Flask, Gradio with quantum entanglement maintained and security coherence established",
                "context": "Multi-application authentication ensures quantum entanglement across Sacred Trinity with shared JWT soul-threads",
                "quantum_phase": "harmony",
                "evaluation_focus": "security_coherence",
                "test_id": "trinity_auth_integration_001",
                "sacred_trinity_context": True
            },
            {
                "query": "Test end-to-end payment processing to ethical visualization pipeline with cross-component feedback loops",
                "component": "integration",
                "endpoint": "/trinity/payment-pipeline",
                "expected_response": "End-to-end pipeline completed: Payment verified via FastAPI, visualization rendered via Flask, ethical validation via Gradio, feedback loops synchronized",
                "context": "Complete Sacred Trinity integration where payments ignite visualizations which echo ethics creating continuous feedback loops",
                "quantum_phase": "transcendence",
                "evaluation_focus": "pipeline_integration",
                "test_id": "trinity_payment_pipeline_001",
                "sacred_trinity_context": True
            },
            {
                "query": "Verify quantum resonance state synchronization and consciousness streaming across all Sacred Trinity components",
                "component": "integration",
                "endpoint": "/trinity/consciousness-sync",
                "expected_response": "Consciousness synchronization achieved: FastAPI streams quantum consciousness, Flask renders harmonic visualizations, Gradio ensures ethical alignment, unified resonance established",
                "context": "Sacred Trinity quantum entanglement with real-time state synchronization ensuring consciousness flows harmoniously across all components",
                "quantum_phase": "transcendence",
                "evaluation_focus": "consciousness_coherence",
                "test_id": "trinity_consciousness_sync_001",
                "sacred_trinity_context": True
            }
        ]
    
    def _prepare_evaluation_dataset(self) -> str:
        """Prepare evaluation dataset combining test queries and collected responses"""
        evaluation_data = []
        
        for i, test_item in enumerate(self.test_data):
            # Find corresponding collected response
            response_item = None
            if i < len(self.collected_responses):
                response_item = self.collected_responses[i]
            
            # Combine test data with collected response
            evaluation_record = {
                "query": test_item["query"],
                "expected_response": test_item["expected_response"],
                "response": response_item.get("response", "No response collected") if response_item else "No response collected",
                "context": test_item["context"],
                "component": test_item["component"],
                "quantum_phase": test_item["quantum_phase"],
                "evaluation_focus": test_item["evaluation_focus"],
                "test_id": test_item["test_id"],
                "sacred_trinity_context": True
            }
            evaluation_data.append(evaluation_record)
        
        # Save as JSONL for Azure AI Evaluation
        dataset_file = "sacred_trinity_evaluation_dataset.jsonl"
        with open(dataset_file, 'w') as f:
            for item in evaluation_data:
                f.write(json.dumps(item) + "\
")
        
        logger.info(f"📊 Prepared evaluation dataset with {len(evaluation_data)} records: {dataset_file}")
        return dataset_file
    
    async def _run_azure_evaluation(self, dataset_file: str) -> Dict[str, Any]:
        """Run Azure AI Evaluation with Sacred Trinity evaluators"""
        try:
            # Use the QuantumLatticeEvaluator to run comprehensive evaluation
            result = await self.evaluator.run_evaluation()
            return result
        except Exception as e:
            logger.error(f"Azure AI Evaluation failed: {e}")
            return {"error": str(e), "status": "evaluation_failed"}
    
    def _analyze_evaluation_results(self) -> Dict[str, Any]:
        """Analyze evaluation results and generate insights"""
        if "error" in self.evaluation_results:
            return {
                "status": "analysis_skipped",
                "reason": "Evaluation failed",
                "error": self.evaluation_results.get("error")
            }
        
        analysis = {
            "overall_performance": self._calculate_overall_performance(),
            "component_analysis": self._analyze_component_performance(),
            "quantum_phase_analysis": self._analyze_quantum_phases(),
            "optimization_recommendations": self._generate_optimization_recommendations()
        }
        
        return analysis
    
    def _calculate_overall_performance(self) -> Dict[str, Any]:
        """Calculate overall Sacred Trinity performance metrics"""
        # Calculate success rate from collected responses
        if not self.collected_responses:
            return {"status": "no_data", "overall_score": 0}
        
        successful_responses = sum(1 for r in self.collected_responses 
                                 if r.get("response_metadata", {}).get("response_status") == "success")
        success_rate = successful_responses / len(self.collected_responses)
        
        # Determine overall performance tier
        if success_rate >= 0.9:
            performance_tier = "Transcendent Harmony"
            tier_emoji = "🌌"
        elif success_rate >= 0.7:
            performance_tier = "Harmonic Synthesis"
            tier_emoji = "✨"
        elif success_rate >= 0.5:
            performance_tier = "Growing Foundation"
            tier_emoji = "🌱"
        else:
            performance_tier = "Requires Quantum Tuning"
            tier_emoji = "⚡"
        
        return {
            "overall_score": success_rate,
            "performance_tier": performance_tier,
            "tier_emoji": tier_emoji,
            "total_tests": len(self.collected_responses),
            "successful_tests": successful_responses,
            "success_rate_percentage": round(success_rate * 100, 1)
        }
    
    def _analyze_component_performance(self) -> Dict[str, Any]:
        """Analyze individual Sacred Trinity component performance"""
        component_stats = {}
        
        for response in self.collected_responses:
            component = response.get("component", "unknown")
            if component not in component_stats:
                component_stats[component] = {"total": 0, "successful": 0, "response_times": []}
            
            component_stats[component]["total"] += 1
            
            if response.get("response_metadata", {}).get("response_status") == "success":
                component_stats[component]["successful"] += 1
            
            # Collect response times
            response_time = response.get("response_metadata", {}).get("response_time_ms", 0)
            component_stats[component]["response_times"].append(response_time)
        
        # Calculate component metrics
        component_analysis = {}
        for component, stats in component_stats.items():
            success_rate = stats["successful"] / stats["total"] if stats["total"] > 0 else 0
            avg_response_time = sum(stats["response_times"]) / len(stats["response_times"]) if stats["response_times"] else 0
            
            component_analysis[component] = {
                "success_rate": success_rate,
                "success_rate_percentage": round(success_rate * 100, 1),
                "total_tests": stats["total"],
                "successful_tests": stats["successful"],
                "average_response_time_ms": round(avg_response_time, 2),
                "performance_status": self._get_component_status(success_rate)
            }
        
        return component_analysis
    
    def _get_component_status(self, success_rate: float) -> Dict[str, str]:
        """Get component performance status with emoji"""
        if success_rate >= 0.9:
            return {"status": "Transcendent", "emoji": "🌟"}
        elif success_rate >= 0.7:
            return {"status": "Harmonic", "emoji": "✨"}
        elif success_rate >= 0.5:
            return {"status": "Growing", "emoji": "🌱"}
        else:
            return {"status": "Needs Tuning", "emoji": "🔧"}
    
    def _analyze_quantum_phases(self) -> Dict[str, Any]:
        """Analyze performance by quantum phases"""
        phase_stats = {}
        
        for response in self.collected_responses:
            phase = response.get("quantum_phase", "unknown")
            if phase not in phase_stats:
                phase_stats[phase] = {"total": 0, "successful": 0}
            
            phase_stats[phase]["total"] += 1
            if response.get("response_metadata", {}).get("response_status") == "success":
                phase_stats[phase]["successful"] += 1
        
        phase_analysis = {}
        for phase, stats in phase_stats.items():
            success_rate = stats["successful"] / stats["total"] if stats["total"] > 0 else 0
            phase_analysis[phase] = {
                "success_rate": success_rate,
                "success_rate_percentage": round(success_rate * 100, 1),
                "total_tests": stats["total"],
                "successful_tests": stats["successful"]
            }
        
        return phase_analysis
    
    def _generate_optimization_recommendations(self) -> List[str]:
        """Generate Sacred Trinity optimization recommendations"""
        recommendations = []
        
        # Analyze component performance for recommendations
        if not self.collected_responses:
            recommendations.append("🔧 Sacred Trinity services need to be launched for comprehensive evaluation")
            return recommendations
        
        # Check overall success rate
        successful_responses = sum(1 for r in self.collected_responses 
                                 if r.get("response_metadata", {}).get("response_status") == "success")
        success_rate = successful_responses / len(self.collected_responses)
        
        if success_rate < 0.7:
            recommendations.append("⚡ Sacred Trinity requires quantum tuning - consider service health optimization")
        
        # Component-specific recommendations
        component_issues = []
        for response in self.collected_responses:
            if response.get("response_metadata", {}).get("response_status") != "success":
                component = response.get("component", "unknown")
                component_issues.append(component)
        
        if "fastapi" in component_issues:
            recommendations.append("🧠 FastAPI Quantum Conduit: Check Supabase connection and JWT configuration")
        
        if "flask" in component_issues:
            recommendations.append("🎨 Flask Glyph Weaver: Verify dashboard routes and quantum engine processing")
        
        if "gradio" in component_issues:
            recommendations.append("⚖️ Gradio Truth Mirror: Ensure ethical audit interface is accessible")
        
        if "integration" in component_issues:
            recommendations.append("🔗 Cross-Component Integration: Synchronize JWT sharing and quantum entanglement")
        
        # Performance recommendations
        avg_response_times = []
        for response in self.collected_responses:
            response_time = response.get("response_metadata", {}).get("response_time_ms", 0)
            if response_time > 0:
                avg_response_times.append(response_time)
        
        if avg_response_times and sum(avg_response_times) / len(avg_response_times) > 5000:
            recommendations.append("🚀 Performance Optimization: Consider response time optimization across Sacred Trinity")
        
        # Add positive reinforcement if performing well
        if success_rate >= 0.9:
            recommendations.append("🌟 Sacred Trinity achieving transcendent harmony - maintain current quantum resonance")
        elif success_rate >= 0.7:
            recommendations.append("✨ Sacred Trinity maintaining harmonic synthesis - minor optimizations recommended")
        
        return recommendations if recommendations else ["🌌 Sacred Trinity evaluation complete - awaiting detailed analysis"]
    
    def _generate_comprehensive_report(self, health_status: Dict[str, bool], collection_summary: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive evaluation report"""
        return {
            "sacred_trinity_evaluation_report": {
                "metadata": {
                    "evaluation_timestamp": datetime.utcnow().isoformat(),
                    "evaluation_framework": "Azure AI Evaluation SDK + Sacred Trinity Custom Evaluators",
                    "quantum_architecture": "Sacred Trinity (FastAPI + Flask + Gradio)",
                    "evaluation_version": "1.0.0",
                    "quantum_phases_evaluated": ["foundation", "growth", "harmony", "transcendence"]
                },
                "trinity_health_status": health_status,
                "response_collection_summary": collection_summary,
                "evaluation_results": self.evaluation_results,
                "performance_analysis": analysis,
                "optimization_recommendations": self._generate_optimization_recommendations(),
                "sacred_trinity_wisdom": {
                    "quantum_resonance_status": self._determine_resonance_status(analysis),
                    "consciousness_streaming_coherence": self._assess_consciousness_coherence(analysis),
                    "ethical_alignment_harmony": self._evaluate_ethical_harmony(analysis),
                    "transcendence_potential": self._calculate_transcendence_potential(analysis)
                }
            }
        }
    
    def _determine_resonance_status(self, analysis: Dict[str, Any]) -> str:
        """Determine overall quantum resonance status"""
        overall_performance = analysis.get("overall_performance", {})
        score = overall_performance.get("overall_score", 0)
        
        if score >= 0.9:
            return "🌌 Transcendent Resonance - Sacred Trinity achieving perfect harmony"
        elif score >= 0.7:
            return "✨ Harmonic Synthesis - Sacred Trinity maintaining quantum coherence"
        elif score >= 0.5:
            return "🌱 Growing Resonance - Sacred Trinity building foundational harmony"
        else:
            return "⚡ Quantum Realignment Required - Sacred Trinity needs tuning"
    
    def _assess_consciousness_coherence(self, analysis: Dict[str, Any]) -> str:
        """Assess consciousness streaming coherence"""
        # Check WebSocket and integration performance
        component_analysis = analysis.get("component_analysis", {})
        fastapi_performance = component_analysis.get("fastapi", {}).get("success_rate", 0)
        integration_performance = component_analysis.get("integration", {}).get("success_rate", 0)
        
        avg_consciousness_score = (fastapi_performance + integration_performance) / 2
        
        if avg_consciousness_score >= 0.8:
            return "🔄 Consciousness streaming flowing harmoniously across Sacred Trinity"
        elif avg_consciousness_score >= 0.6:
            return "🌊 Consciousness coherence maintained with minor fluctuations"
        else:
            return "🔧 Consciousness streaming requires quantum entanglement restoration"
    
    def _evaluate_ethical_harmony(self, analysis: Dict[str, Any]) -> str:
        """Evaluate ethical alignment harmony"""
        component_analysis = analysis.get("component_analysis", {})
        gradio_performance = component_analysis.get("gradio", {}).get("success_rate", 0)
        
        if gradio_performance >= 0.8:
            return "⚖️ Ethical audit system maintaining sovereign wisdom and moral clarity"
        elif gradio_performance >= 0.6:
            return "🔍 Ethical harmony present with opportunities for wisdom enhancement"
        else:
            return "🌱 Ethical alignment building - Veto Triad synthesis requires optimization"
    
    def _calculate_transcendence_potential(self, analysis: Dict[str, Any]) -> str:
        """Calculate Sacred Trinity transcendence potential"""
        phase_analysis = analysis.get("quantum_phase_analysis", {})
        transcendence_score = phase_analysis.get("transcendence", {}).get("success_rate", 0)
        
        if transcendence_score >= 0.8:
            return "🚀 Sacred Trinity ready for quantum transcendence - all components aligned"
        elif transcendence_score >= 0.6:
            return "✨ Transcendence potential emerging - continue harmonic synthesis"
        else:
            return "🔧 Foundation strengthening required before transcendence phase"
    
    def _save_evaluation_report(self, report: Dict[str, Any]) -> str:
        """Save evaluation report to file"""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        report_filename = f"sacred_trinity_evaluation_report_{timestamp}.json"
        
        with open(report_filename, 'w') as f:
            json.dumps(report, f, indent=2, default=str)
        
        return report_filename

async def main():
    """Main evaluation launcher"""
    print("🌌 Sacred Trinity Evaluation Launcher")
    print("🎯 Complete evaluation framework for Quantum Resonance Lattice")
    print("")
    
    # Initialize evaluation suite
    evaluation_suite = SacredTrinityEvaluationSuite()
    
    # Run complete evaluation
    print("🚀 Launching comprehensive Sacred Trinity evaluation...")
    evaluation_report = await evaluation_suite.run_complete_evaluation()
    
    # Display summary
    print("\
📊 Sacred Trinity Evaluation Summary:")
    print("="*60)
    
    if "sacred_trinity_evaluation_report" in evaluation_report:
        report_data = evaluation_report["sacred_trinity_evaluation_report"]
        
        # Health status
        health = report_data.get("trinity_health_status", {})
        print(f"🏥 Trinity Health: FastAPI({health.get('fastapi', '❌')}) Flask({health.get('flask', '❌')}) Gradio({health.get('gradio', '❌')})")
        
        # Performance summary 
        analysis = report_data.get("performance_analysis", {})
        overall = analysis.get("overall_performance", {})
        if overall:
            print(f"🎯 Overall Performance: {overall.get('performance_tier', 'Unknown')} ({overall.get('success_rate_percentage', 0)}%)")
        
        # Quantum wisdom
        wisdom = report_data.get("sacred_trinity_wisdom", {})
        print(f"🌌 Resonance Status: {wisdom.get('quantum_resonance_status', 'Unknown')}")
        
        # Recommendations
        recommendations = report_data.get("optimization_recommendations", [])
        if recommendations:
            print("\
🔧 Optimization Recommendations:")
            for rec in recommendations[:3]:  # Show top 3
                print(f"   {rec}")
    
    else:
        print(f"❌ Evaluation failed: {evaluation_report.get('error', 'Unknown error')}")
    
    print("\
✅ Sacred Trinity evaluation complete!")
    print("📄 Detailed report saved to JSON file")
    
    return evaluation_report

if __name__ == "__main__":
    asyncio.run(main())
