package com.yorungekasasi.game;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public final class MainActivity extends Activity {
  private static final String ONLINE_GAME_URL = "https://yorunge-kasasi-gokhan.gkhany.chatgpt.site/";
  private static final String OFFLINE_GAME_URL = "file:///android_asset/www/index.html";
  private static final long MIN_SPLASH_MS = 1350L;

  private FrameLayout root;
  private WebView webView;
  private LinearLayout errorPanel;
  private View splashPanel;
  private long splashStartedAt;
  private boolean gameRevealed;
  private boolean offlineFallbackAttempted;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().setStatusBarColor(Color.rgb(7, 16, 14));
    getWindow().setNavigationBarColor(Color.rgb(7, 16, 14));
    splashStartedAt = System.currentTimeMillis();
    buildInterface();
    loadOnlineGame();
  }

  private void buildInterface() {
    root = new FrameLayout(this);
    root.setBackgroundColor(Color.rgb(7, 16, 14));

    webView = new WebView(this);
    webView.setBackgroundColor(Color.rgb(7, 16, 14));
    webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
    webView.setVerticalScrollBarEnabled(false);
    webView.setHorizontalScrollBarEnabled(false);
    configureWebView(webView);
    root.addView(webView, new FrameLayout.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    ));

    errorPanel = createErrorPanel();
    errorPanel.setVisibility(View.GONE);
    root.addView(errorPanel, new FrameLayout.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    ));

    splashPanel = createSplashPanel();
    root.addView(splashPanel, new FrameLayout.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    ));
    setContentView(root);
  }

  private void configureWebView(WebView view) {
    WebSettings settings = view.getSettings();
    settings.setJavaScriptEnabled(true);
    settings.setDomStorageEnabled(true);
    settings.setDatabaseEnabled(true);
    settings.setAllowFileAccess(true);
    settings.setAllowContentAccess(false);
    settings.setAllowFileAccessFromFileURLs(true);
    settings.setAllowUniversalAccessFromFileURLs(false);
    settings.setMediaPlaybackRequiresUserGesture(false);
    settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
    settings.setCacheMode(WebSettings.LOAD_DEFAULT);
    settings.setSupportZoom(false);
    settings.setBuiltInZoomControls(false);
    settings.setUserAgentString(settings.getUserAgentString() + " YorungeKasasiAndroid/1.9.8");
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WebView.startSafeBrowsing(this, null);

    view.setWebChromeClient(new WebChromeClient());
    view.setWebViewClient(new WebViewClient() {
      @Override
      public boolean shouldOverrideUrlLoading(WebView webView, WebResourceRequest request) {
        Uri uri = request.getUrl();
        if ("file".equalsIgnoreCase(uri.getScheme())) return false;
        if (isOnlineGameUri(uri)) return false;
        return openExternal(uri);
      }

      @Override
      public void onPageFinished(WebView webView, String url) {
        if (isGamePage(url)) {
          errorPanel.setVisibility(View.GONE);
          revealGameAfterSplash();
        }
      }

      @Override
      public void onReceivedError(WebView webView, WebResourceRequest request, WebResourceError error) {
        if (request.isForMainFrame()) handleMainFrameFailure(request.getUrl().toString());
      }

      @Override
      public void onReceivedHttpError(WebView webView, WebResourceRequest request, WebResourceResponse errorResponse) {
        if (request.isForMainFrame() && errorResponse.getStatusCode() >= 400) {
          handleMainFrameFailure(request.getUrl().toString());
        }
      }
    });
  }

  private boolean isOnlineGameUri(Uri uri) {
    Uri gameUri = Uri.parse(ONLINE_GAME_URL);
    return "https".equalsIgnoreCase(uri.getScheme())
      && gameUri.getHost() != null
      && gameUri.getHost().equalsIgnoreCase(uri.getHost());
  }

  private boolean isGamePage(String url) {
    if (url == null) return false;
    return OFFLINE_GAME_URL.equals(url) || isOnlineGameUri(Uri.parse(url));
  }

  private void loadOnlineGame() {
    offlineFallbackAttempted = false;
    errorPanel.setVisibility(View.GONE);
    webView.loadUrl(ONLINE_GAME_URL);
  }

  private void handleMainFrameFailure(String failedUrl) {
    if (!offlineFallbackAttempted && isOnlineGameUri(Uri.parse(failedUrl))) {
      offlineFallbackAttempted = true;
      webView.loadUrl(OFFLINE_GAME_URL);
      return;
    }
    showLoadError();
  }

  private boolean openExternal(Uri uri) {
    try {
      startActivity(new Intent(Intent.ACTION_VIEW, uri));
      return true;
    } catch (ActivityNotFoundException error) {
      Toast.makeText(this, "Bağlantı açılamadı.", Toast.LENGTH_SHORT).show();
      return true;
    }
  }

  private View createSplashPanel() {
    LinearLayout panel = new LinearLayout(this);
    panel.setOrientation(LinearLayout.VERTICAL);
    panel.setGravity(Gravity.CENTER);
    panel.setPadding(dp(28), dp(28), dp(28), dp(28));
    panel.setBackgroundColor(Color.rgb(7, 16, 14));

    OrbitLogoView logo = new OrbitLogoView();
    panel.addView(logo, new LinearLayout.LayoutParams(dp(156), dp(156)));

    TextView title = new TextView(this);
    title.setText("YÖRÜNGE KASASI");
    title.setTextColor(Color.WHITE);
    title.setTextSize(25);
    title.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
    title.setLetterSpacing(0.08f);
    title.setGravity(Gravity.CENTER);
    LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.WRAP_CONTENT
    );
    titleParams.topMargin = dp(24);
    panel.addView(title, titleParams);

    TextView subtitle = new TextView(this);
    subtitle.setText("Yörüngeni yakala. Rekorunu büyüt.");
    subtitle.setTextColor(Color.rgb(137, 171, 158));
    subtitle.setTextSize(14);
    subtitle.setGravity(Gravity.CENTER);
    LinearLayout.LayoutParams subtitleParams = new LinearLayout.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.WRAP_CONTENT
    );
    subtitleParams.topMargin = dp(9);
    panel.addView(subtitle, subtitleParams);
    return panel;
  }

  private LinearLayout createErrorPanel() {
    LinearLayout panel = new LinearLayout(this);
    panel.setOrientation(LinearLayout.VERTICAL);
    panel.setGravity(Gravity.CENTER);
    panel.setPadding(dp(32), dp(32), dp(32), dp(32));
    panel.setBackgroundColor(Color.rgb(7, 16, 14));

    TextView title = new TextView(this);
    title.setText("Oyun açılamadı");
    title.setTextColor(Color.WHITE);
    title.setTextSize(20);
    title.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
    title.setGravity(Gravity.CENTER);
    panel.addView(title);

    TextView note = new TextView(this);
    note.setText("İnternet bağlantını kontrol edip yeniden dene.");
    note.setTextColor(Color.rgb(166, 188, 180));
    note.setTextSize(15);
    note.setGravity(Gravity.CENTER);
    LinearLayout.LayoutParams noteParams = new LinearLayout.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.WRAP_CONTENT
    );
    noteParams.topMargin = dp(10);
    panel.addView(note, noteParams);

    Button retry = new Button(this);
    retry.setText("YENİDEN DENE");
    retry.setTextColor(Color.rgb(7, 16, 14));
    retry.setTextSize(15);
    GradientDrawable buttonBackground = new GradientDrawable();
    buttonBackground.setColor(Color.rgb(87, 230, 173));
    buttonBackground.setCornerRadius(dp(16));
    retry.setBackground(buttonBackground);
    retry.setOnClickListener(ignored -> {
      loadOnlineGame();
    });
    LinearLayout.LayoutParams retryParams = new LinearLayout.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      dp(52)
    );
    retryParams.topMargin = dp(24);
    panel.addView(retry, retryParams);
    return panel;
  }

  private void revealGameAfterSplash() {
    if (gameRevealed) return;
    gameRevealed = true;
    long elapsed = System.currentTimeMillis() - splashStartedAt;
    long delay = Math.max(0L, MIN_SPLASH_MS - elapsed);
    splashPanel.postDelayed(() -> splashPanel.animate()
      .alpha(0f)
      .setDuration(280L)
      .withEndAction(() -> root.removeView(splashPanel))
      .start(), delay);
  }

  private void showLoadError() {
    if (splashPanel.getParent() == root) root.removeView(splashPanel);
    errorPanel.setVisibility(View.VISIBLE);
  }

  private int dp(int value) {
    return Math.round(value * getResources().getDisplayMetrics().density);
  }

  @Override
  protected void onSaveInstanceState(Bundle outState) {
    webView.saveState(outState);
    super.onSaveInstanceState(outState);
  }

  @Override
  public void onBackPressed() {
    if (webView == null) {
      super.onBackPressed();
      return;
    }
    webView.evaluateJavascript(
      "(function(){try{return window.yorungeHandleBack ? window.yorungeHandleBack() : false;}catch(error){return false;}})();",
      handled -> {
        if ("true".equals(handled)) return;
        if (webView.canGoBack() && !isGamePage(webView.getUrl())) webView.goBack();
        else MainActivity.super.onBackPressed();
      }
    );
  }

  @Override
  protected void onPause() {
    webView.onPause();
    super.onPause();
  }

  @Override
  protected void onResume() {
    super.onResume();
    webView.onResume();
  }

  @Override
  protected void onDestroy() {
    webView.stopLoading();
    webView.destroy();
    super.onDestroy();
  }

  private final class OrbitLogoView extends View {
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

    OrbitLogoView() {
      super(MainActivity.this);
      setLayerType(View.LAYER_TYPE_SOFTWARE, null);
    }

    @Override
    protected void onDraw(Canvas canvas) {
      super.onDraw(canvas);
      float cx = getWidth() / 2f;
      float cy = getHeight() / 2f;
      float unit = Math.min(getWidth(), getHeight()) / 156f;

      paint.setStyle(Paint.Style.STROKE);
      paint.setStrokeWidth(2.2f * unit);
      paint.setColor(Color.rgb(33, 82, 63));
      canvas.drawOval(cx - 65f * unit, cy - 34f * unit, cx + 65f * unit, cy + 34f * unit, paint);
      canvas.save();
      canvas.rotate(-42f, cx, cy);
      canvas.drawOval(cx - 60f * unit, cy - 27f * unit, cx + 60f * unit, cy + 27f * unit, paint);
      canvas.restore();

      paint.setStyle(Paint.Style.FILL);
      paint.setShadowLayer(22f * unit, 0f, 0f, Color.argb(150, 87, 230, 173));
      paint.setColor(Color.rgb(87, 230, 173));
      canvas.drawCircle(cx, cy, 38f * unit, paint);
      paint.clearShadowLayer();

      paint.setColor(Color.rgb(7, 16, 14));
      paint.setTextAlign(Paint.Align.CENTER);
      paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
      paint.setTextSize(47f * unit);
      canvas.drawText("Y", cx, cy + 17f * unit, paint);

      paint.setShadowLayer(15f * unit, 0f, 0f, Color.argb(180, 168, 255, 120));
      paint.setColor(Color.rgb(168, 255, 120));
      canvas.drawCircle(cx + 55f * unit, cy - 28f * unit, 7f * unit, paint);
      paint.clearShadowLayer();
    }
  }
}
