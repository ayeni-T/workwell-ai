from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import joblib
import os
from functools import wraps
import ldap3
from werkzeug.security import check_password_hash
import json

# Import your ML model predictor
from stress_predictor import RealisticMentalHealthPredictor

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change in production
app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key'  # Change in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Enable CORS for React frontend
CORS(app, supports_credentials=True)
jwt = JWTManager(app)

# Initialize ML model
predictor = RealisticMentalHealthPredictor()
model_path = 'models/realistic_mental_health_model.pkl'

# Load or train model
if os.path.exists(model_path):
    model_data = joblib.load(model_path)
    predictor.model = model_data['model']
    predictor.scaler = model_data['scaler']
    predictor.feature_names = model_data['feature_names']
    predictor.feature_importance = model_data['feature_importance']
else:
    # Train model if not exists
    training_data = predictor.create_realistic_data(n_samples=2000)
    predictor.train_realistic_model(training_data)
    predictor.save_model(model_path)

# Mock AD users (same as frontend)
MOCK_AD_USERS = {
    'sarah.johnson@corp.company.com': {
        'password': 'employee123',
        'displayName': 'Sarah Johnson',
        'userPrincipalName': 'sarah.johnson@corp.company.com',
        'samAccountName': 'sjohnson',
        'department': 'Engineering',
        'title': 'Senior Software Developer',
        'manager': 'Mike Chen',
        'office': 'Seattle',
        'memberOf': [
            'CN=Engineering-All,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=Software-Developers,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=WorkWell-Users,OU=Groups,DC=corp,DC=company,DC=com'
        ],
        'role': 'employee',
        'employeeId': '1001'
    },
    'mike.chen@corp.company.com': {
        'password': 'manager123',
        'displayName': 'Mike Chen',
        'userPrincipalName': 'mike.chen@corp.company.com',
        'samAccountName': 'mchen',
        'department': 'Engineering',
        'title': 'Engineering Manager',
        'manager': 'David Rodriguez',
        'office': 'Seattle',
        'memberOf': [
            'CN=Engineering-All,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=Engineering-Managers,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=WorkWell-Managers,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=Management-Team,OU=Groups,DC=corp,DC=company,DC=com'
        ],
        'role': 'manager',
        'employeeId': '1002'
    },
    'lisa.anderson@corp.company.com': {
        'password': 'hr123',
        'displayName': 'Lisa Anderson',
        'userPrincipalName': 'lisa.anderson@corp.company.com',
        'samAccountName': 'landerson',
        'department': 'Human Resources',
        'title': 'HR Director',
        'manager': 'CEO',
        'office': 'New York',
        'memberOf': [
            'CN=HR-All,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=HR-Directors,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=WorkWell-HR,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=Executive-Team,OU=Groups,DC=corp,DC=company,DC=com'
        ],
        'role': 'hr',
        'employeeId': '1003'
    },
    'david.rodriguez@corp.company.com': {
        'password': 'admin123',
        'displayName': 'David Rodriguez',
        'userPrincipalName': 'david.rodriguez@corp.company.com',
        'samAccountName': 'drodriguez',
        'department': 'Information Technology',
        'title': 'System Administrator',
        'manager': 'CTO',
        'office': 'Austin',
        'memberOf': [
            'CN=IT-All,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=Domain Admins,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=WorkWell-Admins,OU=Groups,DC=corp,DC=company,DC=com',
            'CN=System-Administrators,OU=Groups,DC=corp,DC=company,DC=com'
        ],
        'role': 'admin',
        'employeeId': '1004'
    }
}

# Mock employee data for predictions
MOCK_EMPLOYEE_DATA = {
    '1001': {  # Sarah Johnson
        'hours_per_week': 42,
        'overtime_hours': 5,
        'meetings_per_day': 4,
        'manager_support_score': 8,
        'vacation_days_taken': 15,
        'after_hours_emails': 8,
        'deadline_pressure': 4,
        'work_life_balance_score': 7,
        'team_collaboration_score': 8,
        'daily_breaks': 3,
        'weekend_work_days': 1,
        'role_clarity_score': 8,
        'job_tenure_months': 24
    },
    '1002': {  # Mike Chen
        'hours_per_week': 50,
        'overtime_hours': 10,
        'meetings_per_day': 8,
        'manager_support_score': 7,
        'vacation_days_taken': 10,
        'after_hours_emails': 20,
        'deadline_pressure': 7,
        'work_life_balance_score': 5,
        'team_collaboration_score': 7,
        'daily_breaks': 2,
        'weekend_work_days': 2,
        'role_clarity_score': 7,
        'job_tenure_months': 36
    },
    '1003': {  # Lisa Anderson
        'hours_per_week': 45,
        'overtime_hours': 8,
        'meetings_per_day': 6,
        'manager_support_score': 8,
        'vacation_days_taken': 12,
        'after_hours_emails': 15,
        'deadline_pressure': 6,
        'work_life_balance_score': 6,
        'team_collaboration_score': 8,
        'daily_breaks': 2.5,
        'weekend_work_days': 1,
        'role_clarity_score': 9,
        'job_tenure_months': 48
    },
    '1004': {  # David Rodriguez
        'hours_per_week': 55,
        'overtime_hours': 15,
        'meetings_per_day': 5,
        'manager_support_score': 6,
        'vacation_days_taken': 8,
        'after_hours_emails': 30,
        'deadline_pressure': 8,
        'work_life_balance_score': 4,
        'team_collaboration_score': 6,
        'daily_breaks': 1,
        'weekend_work_days': 3,
        'role_clarity_score': 7,
        'job_tenure_months': 60
    }
}

# Helper functions
def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user = get_jwt_identity()
            user_data = MOCK_AD_USERS.get(current_user['email'])
            if not user_data or user_data['role'] not in allowed_roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Authentication endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').lower()
    password = data.get('password')
    
    user = MOCK_AD_USERS.get(email)
    if not user or user['password'] != password:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Create JWT token
    access_token = create_access_token(
        identity={
            'email': email,
            'role': user['role'],
            'employeeId': user['employeeId']
        }
    )
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'displayName': user['displayName'],
            'email': user['userPrincipalName'],
            'department': user['department'],
            'title': user['title'],
            'office': user['office'],
            'role': user['role']
        }
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

# Dashboard endpoints
@app.route('/api/dashboard/employee/<employee_id>', methods=['GET'])
@jwt_required()
def get_employee_dashboard(employee_id):
    current_user = get_jwt_identity()
    
    # Check if user is accessing their own data or has permission
    if current_user['employeeId'] != employee_id and current_user['role'] not in ['manager', 'hr', 'admin']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Get employee data
    employee_data = MOCK_EMPLOYEE_DATA.get(employee_id, {})
    
    # Get ML prediction
    prediction = predictor.predict_risk(employee_data)
    
    # Calculate risk score (0-100)
    risk_scores = {'Low': 25, 'Medium': 50, 'High': 75, 'Critical': 95}
    risk_score = risk_scores.get(prediction['predicted_risk_category'], 50)
    
    # Generate trend data
    trends = []
    for i in range(6):
        month_date = datetime.now() - timedelta(days=30*i)
        trends.append({
            'month': month_date.strftime('%b'),
            'score': risk_score + np.random.randint(-10, 10)
        })
    trends.reverse()
    
    return jsonify({
        'wellness_score': risk_score,
        'risk_category': prediction['predicted_risk_category'],
        'confidence': prediction['confidence_score'],
        'trends': trends,
        'peer_comparison': 'Better' if risk_score < 50 else 'Average',
        'peer_percentile': 100 - risk_score,
        'next_survey_days': 7,
        'recommended_resources': [
            {
                'title': 'Time Management Workshop',
                'confidence': 87,
                'reason': f"Based on {employee_data.get('department', 'your')} role"
            },
            {
                'title': 'Mindfulness Session',
                'confidence': 76,
                'reason': 'Popular in your office'
            },
            {
                'title': 'Career Development',
                'confidence': 92,
                'reason': 'Recommended for your level'
            }
        ]
    }), 200

@app.route('/api/dashboard/manager/<manager_id>', methods=['GET'])
@role_required(['manager', 'hr', 'admin'])
def get_manager_dashboard(manager_id):
    # Generate team data
    team_members = []
    for i in range(12):
        employee_data = {
            'hours_per_week': np.random.uniform(35, 65),
            'overtime_hours': np.random.uniform(0, 20),
            'meetings_per_day': np.random.randint(2, 8),
            'manager_support_score': np.random.uniform(4, 9),
            'vacation_days_taken': np.random.uniform(5, 20),
            'after_hours_emails': np.random.randint(5, 30),
            'deadline_pressure': np.random.uniform(3, 9),
            'work_life_balance_score': np.random.uniform(3, 8),
            'team_collaboration_score': np.random.uniform(4, 9),
            'daily_breaks': np.random.uniform(1, 4),
            'weekend_work_days': np.random.randint(0, 4),
            'role_clarity_score': np.random.uniform(4, 9),
            'job_tenure_months': np.random.randint(6, 60)
        }
        
        prediction = predictor.predict_risk(employee_data)
        risk_scores = {'Low': 25, 'Medium': 50, 'High': 75, 'Critical': 95}
        
        team_members.append({
            'id': f'emp_{i}',
            'name': f'Employee {i+1}',
            'role': 'Developer' if i % 2 == 0 else 'Analyst',
            'department': 'Engineering',
            'risk_score': risk_scores.get(prediction['predicted_risk_category'], 50),
            'risk_category': prediction['predicted_risk_category']
        })
    
    # Count by category
    risk_counts = {'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0}
    for member in team_members:
        risk_counts[member['risk_category']] = risk_counts.get(member['risk_category'], 0) + 1
    
    return jsonify({
        'team_members': team_members,
        'team_size': len(team_members),
        'high_risk_count': risk_counts.get('High', 0) + risk_counts.get('Critical', 0),
        'at_risk_count': risk_counts.get('Medium', 0),
        'healthy_count': risk_counts.get('Low', 0),
        'recent_alerts': [
            {
                'id': 1,
                'employee': 'Sarah Johnson',
                'type': 'high_risk',
                'message': 'Risk score increased 15 points - schedule check-in',
                'timestamp': '2 hours ago',
                'priority': 'urgent'
            },
            {
                'id': 2,
                'employee': 'Alex Brown',
                'type': 'overtime',
                'message': 'Worked 65+ hours this week',
                'timestamp': '1 day ago',
                'priority': 'high'
            }
        ]
    }), 200

@app.route('/api/dashboard/hr', methods=['GET'])
@role_required(['hr', 'admin'])
def get_hr_dashboard():
    # Generate organizational data
    departments = ['Engineering', 'Sales', 'Product', 'Design', 'Marketing']
    org_data = []
    
    total_employees = 0
    total_high_risk = 0
    
    for dept in departments:
        dept_size = np.random.randint(8, 30)
        high_risk = np.random.randint(0, int(dept_size * 0.2))
        medium_risk = np.random.randint(0, int(dept_size * 0.3))
        low_risk = dept_size - high_risk - medium_risk
        
        total_employees += dept_size
        total_high_risk += high_risk
        
        org_data.append({
            'department': dept,
            'total': dept_size,
            'healthy': low_risk,
            'at_risk': medium_risk,
            'high_risk': high_risk,
            'risk_percentage': round((high_risk + medium_risk) / dept_size * 100, 1)
        })
    
    return jsonify({
        'total_employees': total_employees,
        'high_risk_count': total_high_risk,
        'high_risk_percentage': round(total_high_risk / total_employees * 100, 1),
        'avg_risk_score': 34,
        'score_change': -2.1,
        'survey_response_rate': 87,
        'departments': org_data
    }), 200

@app.route('/api/dashboard/admin', methods=['GET'])
@role_required(['admin'])
def get_admin_dashboard():
    return jsonify({
        'system_health': {
            'uptime': 99.94,
            'response_time': 23,
            'error_rate': 0.02,
            'active_users': 847
        },
        'security_metrics': {
            'login_attempts': 12847,
            'failed_logins': 234,
            'suspicious_activity': 12,
            'data_breaches': 0
        },
        'ad_integration': {
            'status': 'healthy',
            'last_sync': '2 minutes ago',
            'synced_users': 1247,
            'synced_groups': 156,
            'errors': 0
        },
        'ai_models': [
            {
                'name': 'Ensemble Burnout Predictor',
                'accuracy': 93.2,
                'status': 'active',
                'predictions_today': 1247
            }
        ]
    }), 200

# Survey endpoints
@app.route('/api/surveys/current', methods=['GET'])
@jwt_required()
def get_current_survey():
    return jsonify({
        'id': 'monthly_wellness_202506',
        'title': 'Monthly Wellness Check-in',
        'questions': [
            {
                'id': 1,
                'question': 'How would you rate your current energy level?',
                'type': 'scale',
                'scale': [1, 2, 3, 4, 5]
            },
            {
                'id': 2,
                'question': 'How manageable is your current workload?',
                'type': 'scale',
                'scale': [1, 2, 3, 4, 5]
            },
            {
                'id': 3,
                'question': 'How supported do you feel by your manager?',
                'type': 'scale',
                'scale': [1, 2, 3, 4, 5]
            },
            {
                'id': 4,
                'question': 'How satisfied are you with your work-life balance?',
                'type': 'scale',
                'scale': [1, 2, 3, 4, 5]
            }
        ]
    }), 200

@app.route('/api/surveys/submit', methods=['POST'])
@jwt_required()
def submit_survey():
    data = request.get_json()
    current_user = get_jwt_identity()
    
    # Process survey response
    # In production, save to database
    
    return jsonify({
        'success': True,
        'message': 'Survey submitted successfully'
    }), 200

# AI Chat endpoints
@app.route('/api/chat/message', methods=['POST'])
@jwt_required()
def chat_message():
    data = request.get_json()
    message = data.get('message', '')
    
    # Simple AI response logic
    response = get_ai_response(message)
    
    return jsonify({
        'response': response,
        'timestamp': datetime.now().isoformat()
    }), 200

def get_ai_response(message):
    """Generate AI response based on message content"""
    message_lower = message.lower()
    
    if 'stress' in message_lower or 'burnout' in message_lower:
        return "I understand you're asking about stress or burnout. Based on current data, our AI models show that 23% of employees are experiencing elevated stress levels. Would you like me to provide personalized stress management techniques or connect you with our employee assistance program?"
    
    elif 'score' in message_lower or 'risk' in message_lower:
        return "Your current wellness score is based on multiple factors including work hours, email patterns, meeting load, and survey responses. The AI analyzes these in real-time. Would you like me to explain what's influencing your score or provide tips to improve it?"
    
    elif 'help' in message_lower or 'support' in message_lower:
        return "I'm here to help! I can:\n• Explain your wellness metrics\n• Provide personalized recommendations\n• Connect you with resources\n• Answer questions about the system\n• Offer stress management tips\n\nWhat would you like to know more about?"
    
    else:
        return "That's a great question! I'm continuously learning to better assist you. For complex queries, I recommend checking our resource library or connecting with your HR team. Is there something specific about your wellness data or the system you'd like me to help with?"

# Prediction endpoint
@app.route('/api/predict/risk', methods=['POST'])
@jwt_required()
def predict_employee_risk():
    data = request.get_json()
    
    # Validate required fields
    required_fields = [
        'hours_per_week', 'overtime_hours', 'meetings_per_day',
        'manager_support_score', 'vacation_days_taken', 'after_hours_emails',
        'deadline_pressure', 'work_life_balance_score', 'team_collaboration_score',
        'daily_breaks', 'weekend_work_days', 'role_clarity_score', 'job_tenure_months'
    ]
    
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Get prediction
    prediction = predictor.predict_risk(data)
    
    return jsonify({
        'predicted_risk_category': prediction['predicted_risk_category'],
        'confidence_score': float(prediction['confidence_score']),
        'class_probabilities': prediction['class_probabilities'],
        'prediction_reliability': prediction['prediction_reliability'],
        'intervention_priority': prediction['intervention_priority']
    }), 200

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': predictor.model is not None
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)

