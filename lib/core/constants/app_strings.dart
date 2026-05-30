abstract final class AppStrings {
  static const String appName = 'Tarteb';

  // Auth
  static const String splashTagline = 'Find your next job in the UAE';
  static const String selectRole = 'I am a...';
  static const String roleCandidate = 'Candidate';
  static const String roleEmployer = 'Employer';
  static const String enterPhone = 'Enter your phone number';
  static const String verifyOtp = 'Verify OTP';

  // Pricing
  static const int unlockCostAed = 50;
  static const int creditPerUnlock = 1;

  // Candidate roles
  static const List<String> candidateRoles = [
    'Cashier',
    'Storekeeper',
    'Driver',
    'Receptionist',
    'Cleaner',
    'Waiter',
    'Cook',
    'Security Guard',
    'Sales Assistant',
    'Delivery',
    'Admin',
    'Warehouse',
    'Barista',
    'Helper',
  ];

  static const List<String> visaStatuses = [
    'Employment Visa',
    'Visit Visa',
    'Own Visa',
    'Cancelled Visa',
  ];

  static const List<String> locations = [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Other',
  ];

  static const List<String> profileRoles = ['candidate', 'employer'];
}
