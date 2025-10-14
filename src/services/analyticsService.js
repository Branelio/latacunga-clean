/**
 * Analytics Service
 * Servicio centralizado para tracking de eventos
 */

class AnalyticsService {
  constructor() {
    this.events = [];
    this.sessionStart = new Date();
    this.userId = null;
  }

  /**
   * Inicializar analytics con usuario
   */
  init(userId) {
    this.userId = userId;
    this.trackEvent('session_start', {
      timestamp: this.sessionStart.toISOString(),
      platform: Platform.OS,
    });
  }

  /**
   * Track evento genérico
   */
  trackEvent(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties: {
        ...properties,
        userId: this.userId,
        timestamp: new Date().toISOString(),
      },
    };

    this.events.push(event);
    console.log('📊 Analytics Event:', event);

    // Aquí puedes integrar con servicios reales:
    // - Firebase Analytics
    // - Amplitude
    // - Mixpanel
    // - Google Analytics
    
    // Ejemplo con Firebase Analytics (descomentado cuando lo integres):
    // import analytics from '@react-native-firebase/analytics';
    // analytics().logEvent(eventName, properties);
  }

  /**
   * Track screen view
   */
  trackScreenView(screenName, properties = {}) {
    this.trackEvent('screen_view', {
      screen_name: screenName,
      ...properties,
    });
  }

  /**
   * Track login
   */
  trackLogin(method = 'email') {
    this.trackEvent('login', { method });
  }

  /**
   * Track signup
   */
  trackSignup(method = 'email') {
    this.trackEvent('signup', { method });
  }

  /**
   * Track report creation
   */
  trackReportCreated(reportType, severity) {
    this.trackEvent('report_created', {
      report_type: reportType,
      severity,
    });
  }

  /**
   * Track collection point view
   */
  trackCollectionPointView(pointId, pointType) {
    this.trackEvent('collection_point_viewed', {
      point_id: pointId,
      point_type: pointType,
    });
  }

  /**
   * Track search
   */
  trackSearch(query, resultsCount) {
    this.trackEvent('search', {
      query,
      results_count: resultsCount,
    });
  }

  /**
   * Track error
   */
  trackError(errorMessage, errorStack = null) {
    this.trackEvent('error', {
      message: errorMessage,
      stack: errorStack,
    });
  }

  /**
   * Track tiempo en pantalla
   */
  trackTimeOnScreen(screenName, durationMs) {
    this.trackEvent('time_on_screen', {
      screen_name: screenName,
      duration_ms: durationMs,
      duration_seconds: Math.floor(durationMs / 1000),
    });
  }

  /**
   * Track user engagement
   */
  trackEngagement(action, target) {
    this.trackEvent('user_engagement', {
      action,
      target,
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName, properties = {}) {
    this.trackEvent('feature_usage', {
      feature: featureName,
      ...properties,
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties) {
    console.log('👤 User Properties:', properties);
    // Ejemplo con Firebase:
    // analytics().setUserProperties(properties);
  }

  /**
   * Set user ID
   */
  setUserId(userId) {
    this.userId = userId;
    console.log('👤 User ID set:', userId);
    // Ejemplo con Firebase:
    // analytics().setUserId(userId);
  }

  /**
   * Obtener todos los eventos (para debug)
   */
  getAllEvents() {
    return this.events;
  }

  /**
   * Limpiar eventos
   */
  clearEvents() {
    this.events = [];
  }

  /**
   * Obtener métricas de sesión
   */
  getSessionMetrics() {
    const sessionDuration = new Date() - this.sessionStart;
    return {
      sessionStart: this.sessionStart,
      sessionDuration,
      eventsCount: this.events.length,
      userId: this.userId,
    };
  }
}

export default new AnalyticsService();
