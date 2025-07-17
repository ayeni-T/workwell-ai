from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import enum

db = SQLAlchemy()

class RiskCategory(enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    display_name = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(100))
    title = db.Column(db.String(100))
    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    office = db.Column(db.String(100))
    role = db.Column(db.String(50), default='employee')
    ad_guid = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    wellness_data = db.relationship('WellnessData', backref='user', lazy='dynamic')
    survey_responses = db.relationship('SurveyResponse', backref='user', lazy='dynamic')
    predictions = db.relationship('RiskPrediction', backref='user', lazy='dynamic')
    alerts = db.relationship('Alert', backref='user', lazy='dynamic')
    subordinates = db.relationship('User', backref=db.backref('manager', remote_side=[id]))

class WellnessData(db.Model):
    __tablename__ = 'wellness_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    
    # Work metrics
    hours_per_week = db.Column(db.Float)
    overtime_hours = db.Column(db.Float)
    meetings_per_day = db.Column(db.Integer)
    after_hours_emails = db.Column(db.Integer)
    weekend_work_days = db.Column(db.Integer)
    
    # Wellness scores
    manager_support_score = db.Column(db.Float)
    work_life_balance_score = db.Column(db.Float)
    team_collaboration_score = db.Column(db.Float)
    role_clarity_score = db.Column(db.Float)
    deadline_pressure = db.Column(db.Float)
    
    # Other metrics
    vacation_days_taken = db.Column(db.Float)
    daily_breaks = db.Column(db.Float)
    job_tenure_months = db.Column(db.Integer)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'date'),)

class RiskPrediction(db.Model):
    __tablename__ = 'risk_predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    prediction_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    risk_category = db.Column(db.Enum(RiskCategory), nullable=False)
    risk_score = db.Column(db.Float, nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    
    # Store probabilities as JSON
    class_probabilities = db.Column(db.JSON)
    feature_contributions = db.Column(db.JSON)
    
    model_version = db.Column(db.String(50))
    intervention_priority = db.Column(db.String(50))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Survey(db.Model):
    __tablename__ = 'surveys'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    questions = db.relationship('SurveyQuestion', backref='survey', lazy='dynamic')

class SurveyQuestion(db.Model):
    __tablename__ = 'survey_questions'
    
    id = db.Column(db.Integer, primary_key=True)
    survey_id = db.Column(db.Integer, db.ForeignKey('surveys.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(50), nullable=False)  # scale, text, multiple_choice
    question_order = db.Column(db.Integer, nullable=False)
    scale_min = db.Column(db.Integer)
    scale_max = db.Column(db.Integer)
    options = db.Column(db.JSON)  # For multiple choice

class SurveyResponse(db.Model):
    __tablename__ = 'survey_responses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    survey_id = db.Column(db.Integer, db.ForeignKey('surveys.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('survey_questions.id'), nullable=False)
    
    response_value = db.Column(db.Text)  # Can store number or text
    response_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    survey = db.relationship('Survey', backref='responses')
    question = db.relationship('SurveyQuestion', backref='responses')

class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    alert_type = db.Column(db.String(50), nullable=False)  # high_risk, overtime, survey_concern
    message = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), nullable=False)  # urgent, high, medium, low
    status = db.Column(db.String(20), default='active')  # active, acknowledged, resolved
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    acknowledged_at = db.Column(db.DateTime)
    resolved_at = db.Column(db.DateTime)
    acknowledged_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    acknowledger = db.relationship('User', foreign_keys=[acknowledged_by], backref='acknowledged_alerts')

class ADSyncLog(db.Model):
    __tablename__ = 'ad_sync_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    sync_start = db.Column(db.DateTime, default=datetime.utcnow)
    sync_end = db.Column(db.DateTime)
    status = db.Column(db.String(20))  # success, failed, partial
    users_synced = db.Column(db.Integer, default=0)
    groups_synced = db.Column(db.Integer, default=0)
    errors = db.Column(db.Integer, default=0)
    error_details = db.Column(db.JSON)
    
class ModelMetrics(db.Model):
    __tablename__ = 'model_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    model_name = db.Column(db.String(100), nullable=False)
    model_version = db.Column(db.String(50), nullable=False)
    
    accuracy = db.Column(db.Float)
    precision = db.Column(db.Float)
    recall = db.Column(db.Float)
    f1_score = db.Column(db.Float)
    
    training_date = db.Column(db.DateTime, default=datetime.utcnow)
    predictions_count = db.Column(db.Integer, default=0)
    last_prediction = db.Column(db.DateTime)
    
    status = db.Column(db.String(20), default='active')  # active, staging, archived
    
class Resource(db.Model):
    __tablename__ = 'resources'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))  # mental_health, stress_management, work_life_balance
    url = db.Column(db.String(500))
    content = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    views = db.Column(db.Integer, default=0)
    
class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message_type = db.Column(db.String(20))  # user, ai
    message_text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # For AI responses
    confidence_score = db.Column(db.Float)
    intent_detected = db.Column(db.String(100))

# Database initialization function
def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")

# Helper functions for database operations
def get_user_latest_wellness_data(user_id):
    """Get the most recent wellness data for a user"""
    return WellnessData.query.filter_by(user_id=user_id).order_by(WellnessData.date.desc()).first()

def get_team_risk_summary(manager_id):
    """Get risk summary for a manager's team"""
    manager = User.query.get(manager_id)
    if not manager:
        return None
    
    team_summary = {
        'total': 0,
        'low_risk': 0,
        'medium_risk': 0,
        'high_risk': 0,
        'critical_risk': 0
    }
    
    for subordinate in manager.subordinates:
        latest_prediction = RiskPrediction.query.filter_by(
            user_id=subordinate.id
        ).order_by(RiskPrediction.prediction_date.desc()).first()
        
        if latest_prediction:
            team_summary['total'] += 1
            if latest_prediction.risk_category == RiskCategory.LOW:
                team_summary['low_risk'] += 1
            elif latest_prediction.risk_category == RiskCategory.MEDIUM:
                team_summary['medium_risk'] += 1
            elif latest_prediction.risk_category == RiskCategory.HIGH:
                team_summary['high_risk'] += 1
            elif latest_prediction.risk_category == RiskCategory.CRITICAL:
                team_summary['critical_risk'] += 1
    
    return team_summary

def create_alert(user_id, alert_type, message, priority='medium'):
    """Create a new alert for a user"""
    alert = Alert(
        user_id=user_id,
        alert_type=alert_type,
        message=message,
        priority=priority
    )
    db.session.add(alert)
    db.session.commit()
    return alert
