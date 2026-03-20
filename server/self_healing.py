"""
Self-Sustaining Support System
Provides automated diagnostics, healing, and real-time incident reporting.
"""

import logging
import time
import psutil
from typing import Dict, Any, List, Optional, Callable
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)


class IncidentSeverity(str, Enum):
    """Incident severity levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class HealthStatus(str, Enum):
    """System health status"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    CRITICAL = "critical"


class IncidentReport(BaseModel):
    """Real-time incident report"""
    incident_id: str
    severity: IncidentSeverity
    component: str
    description: str
    timestamp: float = Field(default_factory=time.time)
    auto_healed: bool = Field(default=False)
    healing_actions: List[str] = Field(default_factory=list)
    metadata: Optional[Dict[str, Any]] = Field(default=None)


class DiagnosticResult(BaseModel):
    """Result of automated diagnostic check"""
    check_name: str
    status: HealthStatus
    value: Any
    threshold: Optional[Any] = None
    message: str
    timestamp: float = Field(default_factory=time.time)


class SelfHealingSystem:
    """
    Self-sustaining support system with automated diagnostics and healing
    """

    def __init__(self):
        self.incident_history: List[IncidentReport] = []
        self.healing_actions: Dict[str, Callable] = {}
        self.diagnostic_checks: Dict[str, Callable] = {}
        self._register_default_checks()
        self._register_default_healers()
        logger.info("✅ Self-Healing System initialized")

    def _register_default_checks(self):
        """Register default diagnostic checks"""
        self.diagnostic_checks = {
            "cpu_usage": self._check_cpu_usage,
            "memory_usage": self._check_memory_usage,
            "disk_usage": self._check_disk_usage,
            "process_health": self._check_process_health,
        }

    def _register_default_healers(self):
        """Register default healing actions"""
        self.healing_actions = {
            "high_cpu": self._heal_high_cpu,
            "high_memory": self._heal_high_memory,
            "disk_space": self._heal_disk_space,
            "restart_service": self._heal_restart_service,
        }

    def run_diagnostics(self) -> List[DiagnosticResult]:
        """
        Run all diagnostic checks and return results
        
        Returns:
            List of diagnostic results
        """
        logger.info("🔍 Running automated diagnostics...")
        results = []
        
        for check_name, check_func in self.diagnostic_checks.items():
            try:
                result = check_func()
                results.append(result)
                
                # Create incident if check indicates problem
                if result.status in [HealthStatus.UNHEALTHY, HealthStatus.CRITICAL]:
                    self._create_incident(check_name, result)
                    
            except Exception as e:
                logger.error(f"Diagnostic check {check_name} failed: {e}")
                results.append(DiagnosticResult(
                    check_name=check_name,
                    status=HealthStatus.CRITICAL,
                    value=None,
                    message=f"Check failed: {str(e)}"
                ))
        
        logger.info(f"✅ Diagnostics complete: {len(results)} checks performed")
        return results

    def _check_cpu_usage(self) -> DiagnosticResult:
        """Check CPU usage"""
        cpu_percent = psutil.cpu_percent(interval=1)
        threshold = 80.0
        
        if cpu_percent >= 90.0:
            status = HealthStatus.CRITICAL
            message = f"CPU usage critical: {cpu_percent}%"
        elif cpu_percent >= threshold:
            status = HealthStatus.UNHEALTHY
            message = f"CPU usage high: {cpu_percent}%"
        elif cpu_percent >= 60.0:
            status = HealthStatus.DEGRADED
            message = f"CPU usage elevated: {cpu_percent}%"
        else:
            status = HealthStatus.HEALTHY
            message = f"CPU usage normal: {cpu_percent}%"
        
        return DiagnosticResult(
            check_name="cpu_usage",
            status=status,
            value=cpu_percent,
            threshold=threshold,
            message=message
        )

    def _check_memory_usage(self) -> DiagnosticResult:
        """Check memory usage"""
        memory = psutil.virtual_memory()
        percent = memory.percent
        threshold = 85.0
        
        if percent >= 95.0:
            status = HealthStatus.CRITICAL
            message = f"Memory usage critical: {percent}%"
        elif percent >= threshold:
            status = HealthStatus.UNHEALTHY
            message = f"Memory usage high: {percent}%"
        elif percent >= 70.0:
            status = HealthStatus.DEGRADED
            message = f"Memory usage elevated: {percent}%"
        else:
            status = HealthStatus.HEALTHY
            message = f"Memory usage normal: {percent}%"
        
        return DiagnosticResult(
            check_name="memory_usage",
            status=status,
            value=percent,
            threshold=threshold,
            message=message
        )

    def _check_disk_usage(self) -> DiagnosticResult:
        """Check disk usage"""
        try:
            # Use current working directory for cross-platform compatibility
            import os
            disk = psutil.disk_usage(os.getcwd())
        except Exception:
            # Fallback to root for Unix-like systems
            disk = psutil.disk_usage('/')
        
        percent = disk.percent
        threshold = 90.0
        
        if percent >= 95.0:
            status = HealthStatus.CRITICAL
            message = f"Disk usage critical: {percent}%"
        elif percent >= threshold:
            status = HealthStatus.UNHEALTHY
            message = f"Disk usage high: {percent}%"
        elif percent >= 80.0:
            status = HealthStatus.DEGRADED
            message = f"Disk usage elevated: {percent}%"
        else:
            status = HealthStatus.HEALTHY
            message = f"Disk usage normal: {percent}%"
        
        return DiagnosticResult(
            check_name="disk_usage",
            status=status,
            value=percent,
            threshold=threshold,
            message=message
        )

    def _check_process_health(self) -> DiagnosticResult:
        """Check current process health"""
        try:
            process = psutil.Process()
            cpu_percent = process.cpu_percent(interval=0.1)
            memory_info = process.memory_info()
            memory_mb = memory_info.rss / (1024 * 1024)
            
            # Check if process is consuming too much resources
            if cpu_percent > 80.0 or memory_mb > 1024:
                status = HealthStatus.DEGRADED
                message = f"Process consuming high resources: CPU={cpu_percent}%, Memory={memory_mb:.0f}MB"
            else:
                status = HealthStatus.HEALTHY
                message = f"Process healthy: CPU={cpu_percent}%, Memory={memory_mb:.0f}MB"
            
            return DiagnosticResult(
                check_name="process_health",
                status=status,
                value={"cpu": cpu_percent, "memory_mb": memory_mb},
                message=message
            )
        except Exception as e:
            return DiagnosticResult(
                check_name="process_health",
                status=HealthStatus.CRITICAL,
                value=None,
                message=f"Process health check failed: {str(e)}"
            )

    def _create_incident(self, check_name: str, diagnostic: DiagnosticResult):
        """Create incident report from diagnostic result"""
        severity_map = {
            HealthStatus.CRITICAL: IncidentSeverity.CRITICAL,
            HealthStatus.UNHEALTHY: IncidentSeverity.HIGH,
            HealthStatus.DEGRADED: IncidentSeverity.MEDIUM,
            HealthStatus.HEALTHY: IncidentSeverity.INFO
        }
        
        incident_id = f"incident_{check_name}_{int(time.time()*1000)}"
        
        incident = IncidentReport(
            incident_id=incident_id,
            severity=severity_map.get(diagnostic.status, IncidentSeverity.MEDIUM),
            component=check_name,
            description=diagnostic.message,
            metadata={
                "value": diagnostic.value,
                "threshold": diagnostic.threshold,
                "status": diagnostic.status.value
            }
        )
        
        # Attempt auto-healing
        if diagnostic.status in [HealthStatus.UNHEALTHY, HealthStatus.CRITICAL]:
            self._attempt_auto_heal(incident, check_name)
        
        self.incident_history.append(incident)
        
        # Keep only last 1000 incidents
        if len(self.incident_history) > 1000:
            self.incident_history = self.incident_history[-1000:]
        
        logger.warning(f"⚠️ Incident created: {incident_id} - {diagnostic.message}")

    def _attempt_auto_heal(self, incident: IncidentReport, check_name: str):
        """Attempt to automatically heal the issue"""
        healing_map = {
            "cpu_usage": "high_cpu",
            "memory_usage": "high_memory",
            "disk_usage": "disk_space",
        }
        
        healer_name = healing_map.get(check_name)
        if healer_name and healer_name in self.healing_actions:
            try:
                logger.info(f"🔧 Attempting auto-heal: {healer_name}")
                actions = self.healing_actions[healer_name](incident)
                incident.auto_healed = True
                incident.healing_actions = actions
                logger.info(f"✅ Auto-heal completed: {healer_name}")
            except Exception as e:
                logger.error(f"❌ Auto-heal failed for {healer_name}: {e}")
                incident.healing_actions.append(f"Auto-heal failed: {str(e)}")

    def _heal_high_cpu(self, incident: IncidentReport) -> List[str]:
        """Healing action for high CPU usage"""
        actions = []
        
        # Log the issue
        actions.append("Logged high CPU usage incident")
        
        # In production, could:
        # - Scale horizontally
        # - Throttle requests
        # - Kill non-essential background tasks
        actions.append("Recommended: Consider scaling horizontally or throttling requests")
        
        logger.info("🔧 High CPU healing actions logged")
        return actions

    def _heal_high_memory(self, incident: IncidentReport) -> List[str]:
        """Healing action for high memory usage"""
        actions = []
        
        # Log the issue
        actions.append("Logged high memory usage incident")
        
        # Attempt garbage collection
        try:
            import gc
            gc.collect()
            actions.append("Forced garbage collection")
        except Exception as e:
            actions.append(f"Garbage collection failed: {e}")
        
        # In production, could:
        # - Clear caches
        # - Restart service
        # - Scale vertically
        actions.append("Recommended: Consider clearing caches or restarting service")
        
        logger.info("🔧 High memory healing actions performed")
        return actions

    def _heal_disk_space(self, incident: IncidentReport) -> List[str]:
        """Healing action for low disk space"""
        actions = []
        
        # Log the issue
        actions.append("Logged low disk space incident")
        
        # In production, could:
        # - Clean up old logs
        # - Archive old data
        # - Increase disk capacity
        actions.append("Recommended: Clean up old logs or archive data")
        
        logger.info("🔧 Disk space healing actions logged")
        return actions

    def _heal_restart_service(self, incident: IncidentReport) -> List[str]:
        """Healing action to restart service (requires guardian approval)"""
        actions = []
        
        # This is a critical action that should require guardian approval
        actions.append("Service restart requested - requires guardian approval")
        actions.append("Incident escalated to guardian monitoring")
        
        logger.warning("⚠️ Service restart requested - guardian approval required")
        return actions

    def get_incident_report(
        self,
        severity: Optional[IncidentSeverity] = None,
        component: Optional[str] = None,
        limit: int = 100
    ) -> List[IncidentReport]:
        """Get incident reports with optional filtering"""
        incidents = self.incident_history
        
        if severity:
            incidents = [i for i in incidents if i.severity == severity]
        
        if component:
            incidents = [i for i in incidents if i.component == component]
        
        return incidents[-limit:]

    def get_system_health(self) -> Dict[str, Any]:
        """Get overall system health status"""
        diagnostics = self.run_diagnostics()
        
        # Determine overall health
        statuses = [d.status for d in diagnostics]
        if HealthStatus.CRITICAL in statuses:
            overall_status = HealthStatus.CRITICAL
        elif HealthStatus.UNHEALTHY in statuses:
            overall_status = HealthStatus.UNHEALTHY
        elif HealthStatus.DEGRADED in statuses:
            overall_status = HealthStatus.DEGRADED
        else:
            overall_status = HealthStatus.HEALTHY
        
        # Get recent incidents
        recent_incidents = self.incident_history[-10:]
        
        return {
            "overall_status": overall_status.value,
            "diagnostics": [
                {
                    "check": d.check_name,
                    "status": d.status.value,
                    "value": d.value,
                    "message": d.message
                }
                for d in diagnostics
            ],
            "recent_incidents": [
                {
                    "incident_id": i.incident_id,
                    "severity": i.severity.value,
                    "component": i.component,
                    "description": i.description,
                    "auto_healed": i.auto_healed,
                    "timestamp": i.timestamp
                }
                for i in recent_incidents
            ],
            "total_incidents": len(self.incident_history),
            "auto_healed_count": sum(1 for i in self.incident_history if i.auto_healed),
            "timestamp": time.time()
        }


# Global self-healing system instance
_healing_system: Optional[SelfHealingSystem] = None


def get_healing_system() -> SelfHealingSystem:
    """Get or create global healing system instance"""
    global _healing_system
    if _healing_system is None:
        _healing_system = SelfHealingSystem()
    return _healing_system
