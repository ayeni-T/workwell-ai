import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Bell, Users, TrendingUp, AlertTriangle, CheckCircle, User, Settings, Calendar, MessageSquare, Target, Brain, Heart, Shield, Cpu, Database, Activity, Zap, Eye, EyeOff, BarChart3, MessageCircle, Send, X, Minimize2, Maximize2, DollarSign, Lock, Globe, Loader2 } from 'lucide-react';

const WorkWellAI = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginStep, setLoginStep] = useState('login'); // 'login', 'authenticating', 'success'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // State management
  const [currentUser, setCurrentUser] = useState('employee');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'ai', message: 'Hi! I\'m your WorkWell AI assistant. I can help you understand your wellness data, provide personalized recommendations, or answer questions about the system. How can I help you today?', timestamp: new Date() }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'AD sync completed: 1,247 users updated', timestamp: new Date() },
    { id: 2, type: 'success', message: 'Active Directory connection healthy', timestamp: new Date() },
    { id: 3, type: 'success', message: 'Monthly survey response rate: 87%', timestamp: new Date() }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('overview');
  const [adSyncStatus, setAdSyncStatus] = useState('connected');
  const [adUser, setAdUser] = useState(null);

  // Mock Active Directory Users Database for Login
  const mockADUsers = {
    'sarah.johnson@corp.company.com': {
      password: 'employee123',
      displayName: 'Sarah Johnson',
      userPrincipalName: 'sarah.johnson@corp.company.com',
      samAccountName: 'sjohnson',
      department: 'Engineering',
      title: 'Senior Software Developer',
      manager: 'Mike Chen',
      office: 'Seattle',
      memberOf: [
        'CN=Engineering-All,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Software-Developers,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=WorkWell-Users,OU=Groups,DC=corp,DC=company,DC=com'
      ],
      role: 'employee'
    },
    'mike.chen@corp.company.com': {
      password: 'manager123',
      displayName: 'Mike Chen',
      userPrincipalName: 'mike.chen@corp.company.com',
      samAccountName: 'mchen',
      department: 'Engineering',
      title: 'Engineering Manager',
      manager: 'David Rodriguez',
      office: 'Seattle',
      memberOf: [
        'CN=Engineering-All,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Engineering-Managers,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=WorkWell-Managers,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Management-Team,OU=Groups,DC=corp,DC=company,DC=com'
      ],
      role: 'manager'
    },
    'lisa.anderson@corp.company.com': {
      password: 'hr123',
      displayName: 'Lisa Anderson',
      userPrincipalName: 'lisa.anderson@corp.company.com',
      samAccountName: 'landerson',
      department: 'Human Resources',
      title: 'HR Director',
      manager: 'CEO',
      office: 'New York',
      memberOf: [
        'CN=HR-All,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=HR-Directors,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=WorkWell-HR,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Executive-Team,OU=Groups,DC=corp,DC=company,DC=com'
      ],
      role: 'hr'
    },
    'david.rodriguez@corp.company.com': {
      password: 'admin123',
      displayName: 'David Rodriguez',
      userPrincipalName: 'david.rodriguez@corp.company.com',
      samAccountName: 'drodriguez',
      department: 'Information Technology',
      title: 'System Administrator',
      manager: 'CTO',
      office: 'Austin',
      memberOf: [
        'CN=IT-All,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Domain Admins,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=WorkWell-Admins,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=System-Administrators,OU=Groups,DC=corp,DC=company,DC=com'
      ],
      role: 'admin'
    }
  };

  // AD Authentication Logic
  const authenticateUser = async (email, password) => {
    setLoginLoading(true);
    setLoginError('');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user exists in mock AD
      const user = mockADUsers[email.toLowerCase()];
      
      if (!user) {
        throw new Error('User not found in Active Directory');
      }
      
      if (user.password !== password) {
        throw new Error('Invalid credentials');
      }
      
      return user;
      
    } catch (error) {
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle login submission
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password');
      return;
    }
    
    try {
      setLoginStep('authenticating');
      const user = await authenticateUser(loginEmail, loginPassword);
      
      setAdUser(user);
      setCurrentUser(user.role);
      setLoginStep('success');
      
      // Simulate redirect to dashboard after success
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 2000);
      
    } catch (error) {
      setLoginError(error.message);
      setLoginStep('login');
    }
  };

  // Demo login buttons
  const demoLogin = async (userType) => {
    const demoCredentials = {
      employee: { email: 'sarah.johnson@corp.company.com', password: 'employee123' },
      manager: { email: 'mike.chen@corp.company.com', password: 'manager123' },
      hr: { email: 'lisa.anderson@corp.company.com', password: 'hr123' },
      admin: { email: 'david.rodriguez@corp.company.com', password: 'admin123' }
    };
    
    const creds = demoCredentials[userType];
    setLoginEmail(creds.email);
    setLoginPassword(creds.password);
    
    // Auto-submit after setting credentials
    setTimeout(() => {
      handleLogin();
    }, 500);
  };

  // Active Directory Integration Data
  const adIntegrationConfig = {
    domainController: 'DC01.corp.company.com',
    ldapPort: 389,
    ldapsPort: 636,
    baseDN: 'DC=corp,DC=company,DC=com',
    serviceAccount: 'WorkWellAI-Service@corp.company.com',
    syncInterval: '15 minutes',
    lastSync: '2 minutes ago',
    status: 'healthy',
    syncedUsers: 1247,
    syncedGroups: 156,
    errors: 0
  };

  // Mock AD User Profiles (what would come from Active Directory)
  const adUserProfiles = {
    'employee': {
      displayName: 'Sarah Johnson',
      samAccountName: 'sjohnson',
      userPrincipalName: 'sarah.johnson@corp.company.com',
      department: 'Engineering',
      title: 'Senior Software Developer',
      manager: 'CN=Mike Chen,OU=Engineering,DC=corp,DC=company,DC=com',
      memberOf: [
        'CN=Engineering-All,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Software-Developers,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=WorkWell-Users,OU=Groups,DC=corp,DC=company,DC=com'
      ],
      office: 'Seattle',
      telephoneNumber: '+1-206-555-0123',
      whenCreated: '2023-03-15T10:30:00Z',
      lastLogon: '2025-06-08T08:15:00Z'
    },
    'manager': {
      displayName: 'Mike Chen',
      samAccountName: 'mchen',
      userPrincipalName: 'mike.chen@corp.company.com',
      department: 'Engineering',
      title: 'Engineering Manager',
      manager: 'CN=David Rodriguez,OU=IT,DC=corp,DC=company,DC=com',
      memberOf: [
        'CN=Engineering-All,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Engineering-Managers,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=WorkWell-Managers,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Management-Team,OU=Groups,DC=corp,DC=company,DC=com'
      ],
      office: 'Seattle',
      telephoneNumber: '+1-206-555-0124',
      directReports: ['CN=Sarah Johnson,OU=Engineering,DC=corp,DC=company,DC=com'],
      whenCreated: '2022-01-10T09:00:00Z',
      lastLogon: '2025-06-08T07:45:00Z'
    },
    'hr': {
      displayName: 'Lisa Anderson',
      samAccountName: 'landerson',
      userPrincipalName: 'lisa.anderson@corp.company.com',
      department: 'Human Resources',
      title: 'HR Director',
      manager: 'CN=CEO,OU=Executive,DC=corp,DC=company,DC=com',
      memberOf: [
        'CN=HR-All,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=HR-Directors,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=WorkWell-HR,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Executive-Team,OU=Groups,DC=corp,DC=company,DC=com'
      ],
      office: 'New York',
      telephoneNumber: '+1-212-555-0125',
      whenCreated: '2021-08-20T14:30:00Z',
      lastLogon: '2025-06-08T08:00:00Z'
    },
    'admin': {
      displayName: 'David Rodriguez',
      samAccountName: 'drodriguez',
      userPrincipalName: 'david.rodriguez@corp.company.com',
      department: 'Information Technology',
      title: 'System Administrator',
      manager: 'CN=CTO,OU=IT,DC=corp,DC=company,DC=com',
      memberOf: [
        'CN=IT-All,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=Domain Admins,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=WorkWell-Admins,OU=Groups,DC=corp,DC=company,DC=com',
        'CN=System-Administrators,OU=Groups,DC=corp,DC=company,DC=com'
      ],
      office: 'Austin',
      telephoneNumber: '+1-512-555-0126',
      whenCreated: '2020-05-12T11:15:00Z',
      lastLogon: '2025-06-08T06:30:00Z'
    }
  };

  // AD Group to WorkWell Role Mapping
  const adGroupRoleMapping = {
    'CN=WorkWell-Users,OU=Groups,DC=corp,DC=company,DC=com': ['employee'],
    'CN=WorkWell-Managers,OU=Groups,DC=corp,DC=company,DC=com': ['manager'],
    'CN=WorkWell-HR,OU=Groups,DC=corp,DC=company,DC=com': ['hr'],
    'CN=WorkWell-Admins,OU=Groups,DC=corp,DC=company,DC=com': ['admin'],
    'CN=Engineering-Managers,OU=Groups,DC=corp,DC=company,DC=com': ['manager'],
    'CN=HR-Directors,OU=Groups,DC=corp,DC=company,DC=com': ['hr'],
    'CN=Domain Admins,OU=Groups,DC=corp,DC=company,DC=com': ['admin']
  };

  // Mock data - moved to top to fix undefined variable issues
  const securityMetrics = {
    loginAttempts: 12847,
    failedLogins: 234,
    suspiciousActivity: 12,
    dataBreaches: 0,
    complianceScore: 97.8,
    vulnerabilities: 3,
    patchingStatus: 98.2,
    backupHealth: 100
  };

  const systemHealth = {
    uptime: 99.94,
    responseTime: 23,
    errorRate: 0.02,
    activeUsers: 847,
    dataProcessed: 2847291,
    alertsProcessed: 1847,
    modelsRunning: 4,
    integrationsActive: 6
  };

  const userRoles = [
    { role: 'Employee', permissions: ['view_own_data', 'take_surveys', 'access_resources'], users: 1247, adGroup: 'WorkWell-Users' },
    { role: 'Manager', permissions: ['view_team_data', 'view_alerts', 'schedule_interventions'], users: 89, adGroup: 'WorkWell-Managers' },
    { role: 'HR Professional', permissions: ['view_org_data', 'manage_surveys', 'generate_reports'], users: 12, adGroup: 'WorkWell-HR' },
    { role: 'System Admin', permissions: ['manage_users', 'configure_integrations', 'view_ai_models'], users: 3, adGroup: 'WorkWell-Admins' },
    { role: 'Executive', permissions: ['view_executive_dashboard', 'export_data', 'policy_insights'], users: 8, adGroup: 'Executive-Team' }
  ];

  const mockEmployees = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Developer', department: 'Engineering', riskScore: 78, status: 'high', manager: 'Mike Chen' },
    { id: 2, name: 'John Smith', role: 'Product Manager', department: 'Product', riskScore: 45, status: 'medium', manager: 'Lisa Park' },
    { id: 3, name: 'Emma Wilson', role: 'Designer', department: 'Design', riskScore: 23, status: 'low', manager: 'David Kim' },
    { id: 4, name: 'Alex Brown', role: 'Developer', department: 'Engineering', riskScore: 67, status: 'high', manager: 'Mike Chen' },
    { id: 5, name: 'Maria Garcia', role: 'Sales Rep', department: 'Sales', riskScore: 52, status: 'medium', manager: 'Tom Wilson' },
    { id: 6, name: 'James Lee', role: 'Analyst', department: 'Analytics', riskScore: 31, status: 'low', manager: 'Susan Davis' }
  ];

  // Admin-specific data
  const aiModels = [
    {
      name: 'Ensemble Burnout Predictor',
      type: 'Random Forest + Gradient Boosting + Neural Network',
      accuracy: 93.2,
      precision: 89.1,
      recall: 94.7,
      f1Score: 91.8,
      lastTrained: '2025-06-01',
      status: 'active',
      predictions: 1247,
      trainingData: '2.3M records'
    },
    {
      name: 'NLP Sentiment Analyzer',
      type: 'Transformer-based (BERT)',
      accuracy: 87.4,
      precision: 85.2,
      recall: 89.8,
      f1Score: 87.4,
      lastTrained: '2025-05-28',
      status: 'active',
      predictions: 8341,
      trainingData: '450K messages'
    },
    {
      name: '1D-CNN Pattern Detector',
      type: 'Convolutional Neural Network',
      accuracy: 91.0,
      precision: 88.7,
      recall: 93.2,
      f1Score: 90.9,
      lastTrained: '2025-05-30',
      status: 'active',
      predictions: 2847,
      trainingData: '1.8M time series'
    },
    {
      name: 'Gradient Boosting Classifier',
      type: 'XGBoost',
      accuracy: 84.6,
      precision: 82.1,
      recall: 87.3,
      f1Score: 84.6,
      lastTrained: '2025-05-25',
      status: 'staging',
      predictions: 0,
      trainingData: '1.1M records'
    }
  ];

  const enterpriseIntegrations = [
    {
      system: 'Active Directory',
      type: 'Identity Provider',
      connection: 'LDAP/LDAPS',
      dataPoints: ['User accounts', 'Group memberships', 'Organizational units', 'Manager relationships'],
      frequency: 'Every 15 min',
      status: 'healthy',
      lastSync: '2 min ago',
      records: '1,247 users, 156 groups',
      sla: '99.9%',
      details: {
        domainController: 'DC01.corp.company.com',
        port: '389/636 (LDAPS)',
        baseDN: 'DC=corp,DC=company,DC=com',
        serviceAccount: 'WorkWellAI-Service'
      }
    },
    {
      system: 'Microsoft 365',
      type: 'Email & Calendar',
      connection: 'Graph API',
      dataPoints: ['Email metadata', 'Calendar events', 'Teams activity'],
      frequency: 'Every 15 min',
      status: 'healthy',
      lastSync: '5 min ago',
      records: '892,431 data points',
      sla: '99.5%'
    },
    {
      system: 'Jira Cloud',
      type: 'Project Management',
      connection: 'REST API',
      dataPoints: ['Task assignments', 'Completion rates', 'Sprint data'],
      frequency: 'Every 30 min',
      status: 'healthy',
      lastSync: '15 min ago',
      records: '5,672 tasks',
      sla: '99.0%'
    },
    {
      system: 'Slack Enterprise',
      type: 'Communication',
      connection: 'Events API',
      dataPoints: ['Message sentiment', 'Participation rates', 'Response times'],
      frequency: 'Real-time',
      status: 'healthy',
      lastSync: '1 min ago',
      records: '23,441 messages',
      sla: '99.8%'
    },
    {
      system: 'BambooHR',
      type: 'HR System',
      connection: 'REST API',
      dataPoints: ['Time off requests', 'Employee satisfaction', 'Exit interviews'],
      frequency: 'Daily',
      status: 'maintenance',
      lastSync: '2 hours ago',
      records: '0 records',
      sla: '98.5%'
    },
    {
      system: 'Tableau Server',
      type: 'Analytics',
      connection: 'REST API',
      dataPoints: ['Dashboard usage', 'Report access patterns'],
      frequency: 'Hourly',
      status: 'healthy',
      lastSync: '45 min ago',
      records: '12,847 events',
      sla: '99.2%'
    }
  ];

  const mockAlerts = [
    { id: 1, employee: 'Sarah Johnson', type: 'high_risk', message: 'Risk score increased 15 points - schedule check-in', timestamp: '2 hours ago', priority: 'urgent' },
    { id: 2, employee: 'Alex Brown', type: 'overtime', message: 'Worked 65+ hours this week', timestamp: '1 day ago', priority: 'high' },
    { id: 3, employee: 'Maria Garcia', type: 'survey', message: 'Reported high stress in monthly survey', timestamp: '3 days ago', priority: 'medium' }
  ];

  const mockSurveyQuestions = [
    { id: 1, question: 'How would you rate your current energy level?', type: 'scale', scale: [1, 2, 3, 4, 5] },
    { id: 2, question: 'How manageable is your current workload?', type: 'scale', scale: [1, 2, 3, 4, 5] },
    { id: 3, question: 'How supported do you feel by your manager?', type: 'scale', scale: [1, 2, 3, 4, 5] },
    { id: 4, question: 'How satisfied are you with your work-life balance?', type: 'scale', scale: [1, 2, 3, 4, 5] }
  ];

  // Helper functions for AD integration
  const determineUserRoleFromAD = (userProfile) => {
    if (!userProfile || !userProfile.memberOf) return 'employee';
    
    // Check AD groups and map to WorkWell roles
    for (const group of userProfile.memberOf) {
      if (adGroupRoleMapping[group]) {
        // Return the highest privilege role found
        const roles = adGroupRoleMapping[group];
        if (roles.includes('admin')) return 'admin';
        if (roles.includes('hr')) return 'hr';
        if (roles.includes('manager')) return 'manager';
      }
    }
    return 'employee';
  };

  const getCurrentUserProfile = () => {
    return adUser || adUserProfiles[currentUser] || adUserProfiles['employee'];
  };

  // Simulate AD authentication and role assignment
  const simulateADLogin = (userType) => {
    const userProfile = adUserProfiles[userType];
    const determinedRole = determineUserRoleFromAD(userProfile);
    setCurrentUser(determinedRole);
    setAdUser(userProfile);
    setCurrentView('dashboard');
  };

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WorkWell AI</h1>
              <p className="text-sm text-gray-500">Enterprise Burnout Prevention</p>
            </div>
          </div>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your.email@company.com"
                disabled={loginLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  disabled={loginLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loginLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{loginError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* AD Integration Status */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-800">Active Directory Integration</p>
                <p className="text-xs text-green-600">Secure enterprise authentication enabled</p>
              </div>
            </div>
          </div>

          {/* Demo Logins */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => demoLogin('employee')}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                disabled={loginLoading}
              >
                👤 Employee
              </button>
              <button
                onClick={() => demoLogin('manager')}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                disabled={loginLoading}
              >
                👥 Manager
              </button>
              <button
                onClick={() => demoLogin('hr')}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                disabled={loginLoading}
              >
                🏢 HR Director
              </button>
              <button
                onClick={() => demoLogin('admin')}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                disabled={loginLoading}
              >
                ⚙️ System Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 WorkWell AI • Enterprise Edition</p>
          <p className="mt-1">Powered by Active Directory Integration</p>
        </div>
      </div>
    </div>
  );

  // Authenticating Page
  const AuthenticatingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
          <p className="text-gray-600 mb-6">Verifying credentials with Active Directory</p>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-gray-600">Connecting to domain controller</span>
            </div>
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-gray-600">Validating user credentials</span>
            </div>
            <div className="flex items-center text-sm">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin mr-2" />
              <span className="text-gray-600">Retrieving group memberships</span>
            </div>
            <div className="flex items-center text-sm opacity-50">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
              <span className="text-gray-400">Determining user roles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Success Page
  const SuccessPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">Authentication successful</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-3">User Details:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{adUser?.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium capitalize">{adUser?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">{adUser?.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Office:</span>
                <span className="font-medium">{adUser?.office}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Role Determination:</h4>
            <p className="text-sm text-blue-700">
              Role "{adUser?.role}" assigned based on Active Directory group membership
            </p>
          </div>
          
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    </div>
  );

  // System Admin Dashboard - Fixed JSX structure
  const SystemAdminDashboard = () => {
    const SystemOverview = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-3xl font-bold text-green-600">{systemHealth.uptime}%</p>
                <p className="text-sm text-green-500">99.9% SLA target</p>
                {/* System Status (for admins) */}
                {currentUser === 'admin' && (
                  <div className="flex items-center space-x-2 text-xs mt-2">
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3 text-green-500" />
                      <span className="text-green-600">99.9%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-blue-500" />
                      <span className="text-blue-600">23ms</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Database className="w-3 h-3 text-purple-500" />
                      <span className="text-purple-600">6 Active</span>
                    </div>
                  </div>
                )}
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-3xl font-bold text-blue-600">{systemHealth.responseTime}ms</p>
                <p className="text-sm text-gray-500">Avg API response</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-purple-600">{systemHealth.activeUsers}</p>
                <p className="text-sm text-gray-500">Currently online</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-3xl font-bold text-red-600">{systemHealth.errorRate}%</p>
                <p className="text-sm text-green-500">Below 0.1% target</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">System Resource Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm text-gray-500">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm text-gray-500">73%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span className="text-sm text-gray-500">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Network I/O</span>
                  <span className="text-sm text-gray-500">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Security Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Firewall Status</span>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">SSL Certificates</span>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Vulnerabilities</span>
                </div>
                <span className="text-sm font-bold text-yellow-700">{securityMetrics.vulnerabilities}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Backup Health</span>
                </div>
                <span className="text-sm font-bold text-green-700">{securityMetrics.backupHealth}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const ActiveDirectoryManagement = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AD Connection</p>
                <p className="text-3xl font-bold text-green-600">Healthy</p>
                <p className="text-sm text-gray-500">Last sync: {adIntegrationConfig.lastSync}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Synced Users</p>
                <p className="text-3xl font-bold text-blue-600">{adIntegrationConfig.syncedUsers}</p>
                <p className="text-sm text-gray-500">From Active Directory</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AD Groups</p>
                <p className="text-3xl font-bold text-purple-600">{adIntegrationConfig.syncedGroups}</p>
                <p className="text-sm text-gray-500">Mapped to roles</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sync Interval</p>
                <p className="text-3xl font-bold text-green-600">15m</p>
                <p className="text-sm text-gray-500">Automatic sync</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* AD Configuration */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Directory Configuration</h3>
              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Test Connection
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Force Sync
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Connection Settings</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domain Controller:</span>
                    <span className="font-mono text-gray-900">{adIntegrationConfig.domainController}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">LDAP Port:</span>
                    <span className="font-mono text-gray-900">{adIntegrationConfig.ldapPort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">LDAPS Port:</span>
                    <span className="font-mono text-gray-900">{adIntegrationConfig.ldapsPort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base DN:</span>
                    <span className="font-mono text-gray-900 text-xs">{adIntegrationConfig.baseDN}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Account:</span>
                    <span className="font-mono text-gray-900 text-xs">{adIntegrationConfig.serviceAccount}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sync Statistics</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Successful Sync:</span>
                    <span className="text-gray-900">{adIntegrationConfig.lastSync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Users Synchronized:</span>
                    <span className="text-gray-900">{adIntegrationConfig.syncedUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Groups Synchronized:</span>
                    <span className="text-gray-900">{adIntegrationConfig.syncedGroups}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sync Errors:</span>
                    <span className="text-green-600">{adIntegrationConfig.errors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Connection Status:</span>
                    <span className="text-green-600 capitalize">{adIntegrationConfig.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AD Group to Role Mapping */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">AD Group to Role Mapping</h3>
            <p className="text-sm text-gray-600">Configure how Active Directory groups map to WorkWell AI roles</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AD Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WorkWell Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Sync</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userRoles.map((role, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{role.adGroup}</p>
                        <p className="text-sm text-gray-500">CN={role.adGroup},OU=Groups,DC=corp,DC=company,DC=com</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {role.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.users.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2 min ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                      <button className="text-green-600 hover:text-green-800">Sync</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent AD Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Active Directory Events</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { time: '2 min ago', event: 'User sync completed', details: '1,247 users updated', type: 'success' },
              { time: '15 min ago', event: 'Group membership changed', details: 'Sarah Johnson added to Engineering-Managers', type: 'info' },
              { time: '1 hour ago', event: 'New user provisioned', details: 'John Smith (jsmith) created', type: 'success' },
              { time: '2 hours ago', event: 'User deprovisioned', details: 'Former employee access revoked', type: 'warning' }
            ].map((event, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'success' ? 'bg-green-500' :
                      event.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.event}</p>
                      <p className="text-sm text-gray-500">{event.details}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const DataIntegrations = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                <p className="text-3xl font-bold text-green-600">6</p>
                <p className="text-sm text-gray-500">Including Active Directory</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Points/Day</p>
                <p className="text-3xl font-bold text-blue-600">2.1M</p>
                <p className="text-sm text-gray-500">Across all sources</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Latency</p>
                <p className="text-3xl font-bold text-purple-600">47ms</p>
                <p className="text-sm text-green-500">Within SLA</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-3xl font-bold text-green-600">99.2%</p>
                <p className="text-sm text-green-500">This month</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Enterprise Data Sources</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Add Integration
              </button>
            </div>
            <p className="text-sm text-gray-600">Real-time monitoring of all enterprise data sources</p>
          </div>
          <div className="divide-y divide-gray-200">
            {enterpriseIntegrations.map((integration, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${
                      integration.status === 'healthy' ? 'bg-green-500' : 
                      integration.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                    } animate-pulse`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{integration.system}</h4>
                      <p className="text-sm text-gray-500">{integration.type} • {integration.connection}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          integration.status === 'healthy' 
                            ? 'bg-green-100 text-green-800' 
                            : integration.status === 'maintenance'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {integration.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>SLA: {integration.sla}</p>
                        <p>Last sync: {integration.lastSync}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Data Points Collected</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {integration.dataPoints.map((point, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Integration Details</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Sync Frequency:</strong> {integration.frequency}</p>
                      <p><strong>Total Records:</strong> {integration.records}</p>
                      <p><strong>Connection Type:</strong> {integration.connection}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const AIModelManagement = () => (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI Model Management</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Deploy New Model
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Environment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {aiModels.map((model, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{model.name}</p>
                        <p className="text-sm text-gray-500">{model.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">v2.1.3</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        model.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {model.status === 'active' ? 'Production' : 'Staging'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {model.accuracy}% accuracy
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Monitor</button>
                      <button className="text-green-600 hover:text-green-800 mr-3">Retrain</button>
                      <button className="text-gray-600 hover:text-gray-800">Archive</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    const UserManagement = () => (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Role-Based Access Control</h3>
              <div className="flex space-x-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                  Add User
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Bulk Import
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">Define what each user role can access and modify</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userRoles.map((role, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {role.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.users.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((perm, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {perm.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                      <button className="text-gray-600 hover:text-gray-800">Users</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">System Administration</h2>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">System Health: Optimal</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'System Overview', icon: Activity },
              { id: 'activedirectory', name: 'Active Directory', icon: Shield },
              { id: 'integrations', name: 'Data Sources', icon: Database },
              { id: 'models', name: 'AI Models', icon: Brain },
              { id: 'users', name: 'User Management', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminActiveTab(tab.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  adminActiveTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {adminActiveTab === 'overview' && <SystemOverview />}
        {adminActiveTab === 'activedirectory' && <ActiveDirectoryManagement />}
        {adminActiveTab === 'integrations' && <DataIntegrations />}
        {adminActiveTab === 'models' && <AIModelManagement />}
        {adminActiveTab === 'users' && <UserManagement />}
      </div>
    );
  };

  // Utility functions
  const getRiskColor = (score) => {
    if (score >= 67) return 'text-red-600 bg-red-100';
    if (score >= 34) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLevel = (score) => {
    if (score >= 67) return 'High Risk';
    if (score >= 34) return 'At Risk';
    return 'Healthy';
  };

  // AI Chatbox responses
  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('burnout')) {
      return "I understand you're asking about stress or burnout. Based on current data, our AI models show that 23% of employees are experiencing elevated stress levels. Would you like me to provide personalized stress management techniques or connect you with our employee assistance program?";
    }
    
    if (lowerMessage.includes('score') || lowerMessage.includes('risk')) {
      return "Your current wellness score is based on multiple factors including work hours, email patterns, meeting load, and survey responses. The AI analyzes these in real-time. Would you like me to explain what's influencing your score or provide tips to improve it?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! I can:\n• Explain your wellness metrics\n• Provide personalized recommendations\n• Connect you with resources\n• Answer questions about the system\n• Offer stress management tips\n\nWhat would you like to know more about?";
    }
    
    return "That's a great question! I'm continuously learning to better assist you. For complex queries, I recommend checking our resource library or connecting with your HR team. Is there something specific about your wellness data or the system you'd like me to help with?";
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        message: getAIResponse(currentMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Employee Dashboard
  const EmployeeDashboard = () => {
    const personalTrends = [
      { month: 'Jan', score: 25 },
      { month: 'Feb', score: 30 },
      { month: 'Mar', score: 35 },
      { month: 'Apr', score: 28 },
      { month: 'May', score: 32 },
      { month: 'Jun', score: 29 }
    ];

    const currentProfile = getCurrentUserProfile();

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Your AI-Powered Wellness Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700">AD Synced</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600">AI Analysis: Real-time • Last updated: Now</span>
            </div>
          </div>
        </div>

        {/* User Profile from AD */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Active Directory Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{currentProfile.displayName}</p>
            </div>
            <div>
              <p className="text-gray-500">Department</p>
              <p className="font-medium">{currentProfile.department}</p>
            </div>
            <div>
              <p className="text-gray-500">Office</p>
              <p className="font-medium">{currentProfile.office}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Login</p>
              <p className="font-medium">Today 8:15 AM</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Wellness Score</p>
                <p className="text-3xl font-bold text-green-600">29</p>
                <p className="text-sm text-gray-500">Healthy Range</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Peer Comparison</p>
                <p className="text-3xl font-bold text-blue-600">Better</p>
                <p className="text-sm text-gray-500">Than 72% of {currentProfile.department}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Survey</p>
                <p className="text-3xl font-bold text-purple-600">7</p>
                <p className="text-sm text-gray-500">Days remaining</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Your Wellness Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={personalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">AI-Recommended Resources</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                <p className="font-medium text-blue-800">Time Management Workshop</p>
                <p className="text-sm text-blue-600">AI Confidence: 87% • Based on {currentProfile.department} role</p>
              </div>
              <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                <p className="font-medium text-green-800">Mindfulness Session</p>
                <p className="text-sm text-green-600">AI Confidence: 76% • Popular in {currentProfile.office}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                <p className="font-medium text-purple-800">Career Development</p>
                <p className="text-sm text-purple-600">AI Confidence: 92% • Recommended for {currentProfile.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Manager Dashboard
  const ManagerDashboard = () => {
    const teamData = [
      { name: 'Engineering', healthy: 4, atRisk: 2, highRisk: 2 },
      { name: 'Product', healthy: 3, atRisk: 1, highRisk: 0 },
      { name: 'Design', healthy: 5, atRisk: 1, highRisk: 1 }
    ];

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Team Management Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-red-500" />
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">3 New Alerts</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-yellow-600">3</p>
              </div>
              <Target className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Healthy</p>
                <p className="text-2xl font-bold text-green-600">7</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded border-l-4 ${
                  alert.priority === 'urgent' ? 'border-red-500 bg-red-50' :
                  alert.priority === 'high' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{alert.employee}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Team Risk Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="healthy" fill="#10B981" />
                <Bar dataKey="atRisk" fill="#F59E0B" />
                <Bar dataKey="highRisk" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // HR Dashboard
  const HRDashboard = () => {
    const orgData = [
      { department: 'Engineering', total: 25, healthy: 15, atRisk: 7, highRisk: 3 },
      { department: 'Sales', total: 18, healthy: 12, atRisk: 4, highRisk: 2 },
      { department: 'Product', total: 12, healthy: 8, atRisk: 3, highRisk: 1 },
      { department: 'Design', total: 10, healthy: 7, atRisk: 2, highRisk: 1 },
      { department: 'Marketing', total: 8, healthy: 6, atRisk: 2, highRisk: 0 }
    ];

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Organizational Wellness Dashboard</h2>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-800">73</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-red-600">7</p>
                <p className="text-sm text-red-500">9.6% of workforce</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
                <p className="text-3xl font-bold text-blue-600">34</p>
                <p className="text-sm text-green-500">↓ 2.1 from last month</p>
              </div>
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Survey Response</p>
                <p className="text-3xl font-bold text-green-600">87%</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Department Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Healthy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">At Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">High Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orgData.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {dept.healthy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      {dept.atRisk}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {dept.highRisk}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(((dept.atRisk + dept.highRisk) / dept.total) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Survey Component
  const SurveyComponent = () => {
    const handleSurveySubmit = () => {
      setSurveyCompleted(true);
      setTimeout(() => {
        setSurveyCompleted(false);
        setCurrentView('dashboard');
      }, 3000);
    };

    if (surveyCompleted) {
      return (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Survey Completed!</h2>
            <p className="text-green-600 mb-4">Thank you for taking the time to share your feedback.</p>
            <p className="text-sm text-gray-600">Your responses help us create a better workplace for everyone.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Wellness Check-in</h2>
          <p className="text-gray-600 mb-8">This should take about 5 minutes. Your responses are confidential and help us support your wellbeing.</p>
          
          <div className="space-y-6">
            {mockSurveyQuestions.map((q, index) => (
              <div key={q.id} className="space-y-3">
                <p className="font-medium text-gray-700">{index + 1}. {q.question}</p>
                <div className="flex space-x-2">
                  {q.scale.map((value) => (
                    <button
                      key={value}
                      onClick={() => setSurveyResponses({...surveyResponses, [q.id]: value})}
                      className={`w-12 h-12 rounded-full border-2 font-medium ${
                        surveyResponses[q.id] === value 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSurveySubmit}
            disabled={Object.keys(surveyResponses).length < mockSurveyQuestions.length}
            className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Survey
          </button>
        </div>
      </div>
    );
  };

  // AI Chatbox Component
  const AIChatbox = () => {
    if (!chatOpen) {
      return (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-50"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
            !
          </span>
        </button>
      );
    }

    return (
      <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border transition-all duration-300 z-50 ${
        chatMinimized ? 'w-80 h-16' : 'w-96 h-96'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span className="font-medium">WorkWell AI Assistant</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChatMinimized(!chatMinimized)}
              className="text-white hover:text-gray-200"
            >
              {chatMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!chatMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto max-h-64 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg p-3 ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.type === 'ai' && (
                      <div className="flex items-center space-x-1 mb-1">
                        <Brain className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{msg.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <Brain className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me about your wellness data..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTyping}
                />
                <button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => setCurrentMessage("What's my wellness score?")}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                >
                  My Score
                </button>
                <button
                  onClick={() => setCurrentMessage("How can I reduce stress?")}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Reduce Stress
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Authentication Flow */}
      {!isAuthenticated && (
        <>
          {loginStep === 'login' && <LoginPage />}
          {loginStep === 'authenticating' && <AuthenticatingPage />}
          {loginStep === 'success' && <SuccessPage />}
        </>
      )}

      {/* Main Application */}
      {isAuthenticated && (
        <div className="min-h-screen bg-gray-100">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">WorkWell AI</h1>
                    <p className="text-xs text-gray-500">Enterprise Burnout Prevention Platform</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600">Live</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">AD Authenticated</span>
                    </div>
                    {/*
                    <select 
                      value={currentUser} 
                      onChange={(e) => simulateADLogin(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="employee">👤 Sarah Johnson (Employee)</option>
                      <option value="manager">👥 Mike Chen (Manager)</option>
                      <option value="hr">🏢 Lisa Anderson (HR Director)</option>
                      <option value="admin">⚙️ David Rodriguez (Sys Admin)</option>
                    </select>*/}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 border-l pl-4">
                    <User className="w-4 h-4" />
                    <div>
                      <p className="font-medium">
                        {getCurrentUserProfile().displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getCurrentUserProfile().title} • {getCurrentUserProfile().department}
                      </p>
                      <p className="text-xs text-gray-400">
                        {getCurrentUserProfile().userPrincipalName}
                      </p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setIsAuthenticated(false);
                      setAdUser(null);
                      setLoginStep('login');
                      setLoginEmail('');
                      setLoginPassword('');
                      setLoginError('');
                      setCurrentView('dashboard');
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <nav className="bg-white shadow-sm">
            <div className="px-6 py-2">
              <div className="flex space-x-8">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentView === 'dashboard' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
                
                {currentUser === 'employee' && (
                  <button
                    onClick={() => setCurrentView('survey')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      currentView === 'survey' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Monthly Survey
                  </button>
                )}

                {(currentUser === 'hr' || currentUser === 'admin') && (
                  <button
                    onClick={() => setCurrentView('ai-insights')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      currentView === 'ai-insights' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    AI Insights
                  </button>
                )}
                
                <button
                  onClick={() => setCurrentView('resources')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentView === 'resources' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Resources
                </button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {currentView === 'dashboard' && (
              <>
                {currentUser === 'employee' && <EmployeeDashboard />}
                {currentUser === 'manager' && <ManagerDashboard />}
                {currentUser === 'hr' && <HRDashboard />}
                {currentUser === 'admin' && <SystemAdminDashboard />}
              </>
            )}
            
            {currentView === 'survey' && currentUser === 'employee' && <SurveyComponent />}
            
            {currentView === 'ai-insights' && (currentUser === 'hr' || currentUser === 'admin') && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">AI Insights & Analytics</h2>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600">Model Performance: 93.2% Accuracy</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">AI Predictions Today</p>
                        <p className="text-3xl font-bold text-purple-600">12,435</p>
                        <p className="text-sm text-gray-500">All employees analyzed</p>
                      </div>
                      <Brain className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">High-Risk Alerts</p>
                        <p className="text-3xl font-bold text-red-600">23</p>
                        <p className="text-sm text-gray-500">Requiring intervention</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
                        <p className="text-3xl font-bold text-green-600">93.2%</p>
                        <p className="text-sm text-green-500">↑ 2.1% this month</p>
                      </div>
                      <Target className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Intervention Success</p>
                        <p className="text-3xl font-bold text-blue-600">76.8%</p>
                        <p className="text-sm text-gray-500">Risk reduction rate</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">AI Model Performance</h3>
                    <p className="text-sm text-gray-600">Real-time accuracy metrics across all models</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Predictions Today</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {aiModels.slice(0, 3).map((model, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="font-medium text-gray-900">{model.name}</p>
                                <p className="text-sm text-gray-500">Training: {model.trainingData}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{model.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-lg font-bold text-purple-600">{model.accuracy}%</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {model.predictions.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {currentView === 'resources' && (
              <div className="p-6">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Wellness Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <Heart className="w-8 h-8 text-red-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Mental Health Support</h3>
                      <p className="text-gray-600 mb-4">24/7 counseling and mental health resources</p>
                      <button className="text-blue-600 font-medium hover:text-blue-800">Learn More →</button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                      <Target className="w-8 h-8 text-green-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Stress Management</h3>
                      <p className="text-gray-600 mb-4">Tools and techniques for managing workplace stress</p>
                      <button className="text-blue-600 font-medium hover:text-blue-800">Learn More →</button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                      <Shield className="w-8 h-8 text-blue-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Work-Life Balance</h3>
                      <p className="text-gray-600 mb-4">Strategies for maintaining healthy boundaries</p>
                      <button className="text-blue-600 font-medium hover:text-blue-800">Learn More →</button>
                    </div>

                    {currentUser === 'admin' && (
                      <>
                        <div className="bg-white p-6 rounded-lg shadow">
                          <Settings className="w-8 h-8 text-gray-500 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
                          <p className="text-gray-600 mb-4">Configure system settings and integrations</p>
                          <button className="text-blue-600 font-medium hover:text-blue-800">Configure →</button>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                          <Database className="w-8 h-8 text-purple-500 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Data Management</h3>
                          <p className="text-gray-600 mb-4">Monitor and manage enterprise data sources</p>
                          <button className="text-blue-600 font-medium hover:text-blue-800">Manage →</button>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                          <Brain className="w-8 h-8 text-indigo-500 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">AI Model Training</h3>
                          <p className="text-gray-600 mb-4">Deploy and monitor machine learning models</p>
                          <button className="text-blue-600 font-medium hover:text-blue-800">Deploy →</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* AI Chatbox */}
          <AIChatbox />

          {/* Footer */}
          <footer className="bg-gray-50 border-t px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>WorkWell AI v2.1.3</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>SOC 2 Compliant</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span className="text-green-600">AD Integrated</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span>© 2025 WorkWell AI</span>
                <span className="text-green-600 text-xs">AD Sync: {adIntegrationConfig.lastSync}</span>
                <button className="text-blue-600 hover:text-blue-800">Support</button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default WorkWellAI;