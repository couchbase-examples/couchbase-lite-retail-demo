import 'dart:async';
import 'dart:developer' as dev;
import 'package:cbl/cbl.dart';
import '../config/app_config.dart';
import 'database_manager.dart';

enum SyncStatus {
  stopped,
  connecting,
  busy,
  idle,
  offline,
  error,
}

class SyncManager {
  static final SyncManager _instance = SyncManager._internal();
  factory SyncManager() => _instance;
  SyncManager._internal();

  Replicator? _replicator;
  ListenerToken? _listenerToken;
  final _statusController = StreamController<SyncStatus>.broadcast();
  SyncStatus _currentStatus = SyncStatus.stopped;

  Stream<SyncStatus> get statusStream => _statusController.stream;
  SyncStatus get currentStatus => _currentStatus;
  bool get isRunning => _replicator != null && _currentStatus != SyncStatus.stopped;

  Future<void> startSync(String username, String password) async {
    if (_replicator != null) {
      dev.log('[SyncManager] Replicator already exists, skipping');
      return;
    }

    final dbManager = DatabaseManager();
    if (!dbManager.isInitialized) {
      dev.log('[SyncManager] DB not initialized, cannot start sync');
      return;
    }

    dev.log('[SyncManager] Starting sync to: ${AppConfig.syncGatewayUrl}');
    dev.log('[SyncManager] Username: $username');
    final target = UrlEndpoint(Uri.parse(AppConfig.syncGatewayUrl));

    final config = ReplicatorConfiguration(target: target)
      ..authenticator = BasicAuthenticator(
        username: username,
        password: password,
      )
      ..replicatorType = ReplicatorType.pushAndPull
      ..continuous = true
      ..heartbeat = Duration(seconds: AppConfig.syncHeartbeat)
      ..maxAttempts = AppConfig.syncMaxAttempts
      ..maxAttemptWaitTime = Duration(seconds: AppConfig.syncMaxAttemptWaitTime);

    if (dbManager.inventoryCollection != null) {
      config.addCollection(dbManager.inventoryCollection!);
    }
    if (dbManager.ordersCollection != null) {
      config.addCollection(dbManager.ordersCollection!);
    }
    if (dbManager.profileCollection != null) {
      config.addCollection(dbManager.profileCollection!);
    }

    dev.log('[SyncManager] Collections: inv=${dbManager.inventoryCollection != null}, orders=${dbManager.ordersCollection != null}, profile=${dbManager.profileCollection != null}');

    _replicator = await Replicator.create(config);
    dev.log('[SyncManager] Replicator created');

    _listenerToken = await _replicator!.addChangeListener((change) {
      final activity = change.status.activity;
      dev.log('[SyncManager] Activity: $activity');
      switch (activity) {
        case ReplicatorActivityLevel.stopped:
          _updateStatus(SyncStatus.stopped);
        case ReplicatorActivityLevel.offline:
          _updateStatus(SyncStatus.offline);
        case ReplicatorActivityLevel.connecting:
          _updateStatus(SyncStatus.connecting);
        case ReplicatorActivityLevel.idle:
          _updateStatus(SyncStatus.idle);
        case ReplicatorActivityLevel.busy:
          _updateStatus(SyncStatus.busy);
      }

      final error = change.status.error;
      if (error != null) {
        dev.log('[SyncManager] ERROR: $error');
        _updateStatus(SyncStatus.error);
      }

      final progress = change.status.progress;
      dev.log('[SyncManager] Progress: completed=${progress.completed}');
    });

    await _replicator!.start();
    dev.log('[SyncManager] Replicator started');
  }

  void _updateStatus(SyncStatus status) {
    _currentStatus = status;
    _statusController.add(status);
  }

  Future<void> stopSync() async {
    if (_replicator == null) return;

    if (_listenerToken != null) {
      await _replicator!.removeChangeListener(_listenerToken!);
      _listenerToken = null;
    }

    await _replicator!.stop();
    await _replicator!.close();
    _replicator = null;
    _updateStatus(SyncStatus.stopped);
  }

  Future<void> dispose() async {
    await stopSync();
    await _statusController.close();
  }
}
