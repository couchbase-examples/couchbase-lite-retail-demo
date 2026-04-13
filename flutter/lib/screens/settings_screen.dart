import 'dart:async';
import 'package:flutter/material.dart';
import '../services/auth_manager.dart';
import '../services/sync_manager.dart';
import '../config/app_config.dart';
import '../theme/app_theme.dart';
import 'login_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  SyncStatus _syncStatus = SyncStatus.stopped;
  bool _syncEnabled = true;
  StreamSubscription? _statusSubscription;

  @override
  void initState() {
    super.initState();
    _syncStatus = SyncManager().currentStatus;
    _syncEnabled = SyncManager().isRunning;
    _statusSubscription = SyncManager().statusStream.listen((status) {
      if (mounted) setState(() => _syncStatus = status);
    });
  }

  @override
  void dispose() {
    _statusSubscription?.cancel();
    super.dispose();
  }

  String _statusText(SyncStatus status) {
    switch (status) {
      case SyncStatus.stopped:
        return 'Stopped';
      case SyncStatus.connecting:
        return 'Connecting...';
      case SyncStatus.busy:
        return 'Syncing...';
      case SyncStatus.idle:
        return 'Connected';
      case SyncStatus.offline:
        return 'Offline';
      case SyncStatus.error:
        return 'Error';
    }
  }

  Future<void> _toggleSync(bool enabled) async {
    setState(() => _syncEnabled = enabled);
    if (enabled) {
      final auth = AuthManager();
      if (auth.currentUsername != null) {
        final cred = AppConfig.demoCredentials
            .where((c) => c.username == auth.currentUsername)
            .firstOrNull;
        if (cred != null) {
          await SyncManager().startSync(cred.username, cred.password);
        }
      }
    } else {
      await SyncManager().stopSync();
    }
  }

  Future<void> _signOut() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Sign Out', style: TextStyle(color: AppTheme.errorRed)),
          ),
        ],
      ),
    );

    if (confirm == true && mounted) {
      await AuthManager().logout();
      if (mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = AuthManager();
    return Scaffold(
      backgroundColor: const Color(0xFFF2F2F7),
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: const Color(0xFFF2F2F7),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        children: [
          // User Information section
          _sectionHeader('User Information'),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 24,
                  backgroundColor: AppTheme.accentBlue,
                  child: Icon(Icons.person, size: 24, color: Colors.white),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        auth.currentFullName ?? 'User',
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        auth.currentUsername ?? '',
                        style: const TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppTheme.accentBlue.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'Store Manager',
                          style: TextStyle(
                            color: AppTheme.accentBlue,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Sync Controls section
          _sectionHeader('Sync Controls'),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                // Refresh Data
                ListTile(
                  leading: const Icon(Icons.refresh, color: AppTheme.accentBlue),
                  title: const Text(
                    'Refresh Data',
                    style: TextStyle(
                      color: AppTheme.accentBlue,
                      fontWeight: FontWeight.w500,
                      fontSize: 16,
                    ),
                  ),
                  onTap: () {
                    // Trigger manual refresh
                  },
                ),
                const Divider(height: 1, indent: 16, endIndent: 16),
                // App Services toggle
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    children: [
                      Icon(
                        Icons.cloud,
                        color: _syncEnabled ? AppTheme.accentBlue : Colors.grey,
                        size: 22,
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Text(
                          'App Services',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                      ),
                      Switch.adaptive(
                        value: _syncEnabled,
                        onChanged: _toggleSync,
                        activeColor: AppTheme.successGreen,
                      ),
                    ],
                  ),
                ),
                // Sync status
                if (_syncEnabled)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(52, 0, 16, 12),
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: _syncStatus == SyncStatus.idle
                                ? AppTheme.successGreen
                                : _syncStatus == SyncStatus.busy || _syncStatus == SyncStatus.connecting
                                    ? AppTheme.primaryOrange
                                    : Colors.grey,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Icon(Icons.cloud_outlined, size: 16, color: Colors.grey[400]),
                        const SizedBox(width: 4),
                        Text(
                          _statusText(_syncStatus),
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // App Information section
          _sectionHeader('App Information'),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                _infoRow(Icons.info_outline, 'Version', '1.0.0'),
                const Divider(height: 1, indent: 52, endIndent: 16),
                _infoRow(Icons.build_outlined, 'Build', '2024.09.22'),
                const Divider(height: 1, indent: 52, endIndent: 16),
                _infoRow(Icons.storage_outlined, 'Database', 'Couchbase Lite'),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Sign Out
          GestureDetector(
            onTap: _signOut,
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.logout, color: AppTheme.errorRed, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Sign Out',
                    style: TextStyle(
                      color: AppTheme.errorRed,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _sectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AppTheme.accentBlue,
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.textSecondary, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontSize: 15, color: AppTheme.textPrimary),
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 15, color: AppTheme.textSecondary),
          ),
        ],
      ),
    );
  }
}
