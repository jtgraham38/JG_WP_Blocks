<?php

//exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

//stable class suffix so each instance can have its own match/unmatch styles
$instance_id = preg_replace( '/[^a-zA-Z0-9_-]/', '', (string) ( $attributes['instanceId'] ?? '' ) );
if ( $instance_id === '' ) {
    $instance_id = wp_unique_id( 'rd' );
}

//class names the inspector style boxes target
$match_class   = 'jg_blocks-responsive_display_match-' . $instance_id;
$unmatch_class = 'jg_blocks-responsive_display_unmatch-' . $instance_id;

//strip markup so user CSS cannot break out of the style tag
$match_styles   = str_ireplace( array( '</style', '<script' ), '', wp_strip_all_tags( (string) ( $attributes['matchStyles'] ?? '' ) ) );
$unmatch_styles = str_ireplace( array( '</style', '<script' ), '', wp_strip_all_tags( (string) ( $attributes['unmatchStyles'] ?? '' ) ) );
$media_query    = (string) ( $attributes['mediaQuery'] ?? '' );

?>

<?php if ( $match_styles !== '' || $unmatch_styles !== '' ) : ?>
    <style>
        .<?php echo esc_html( $match_class ); ?> { <?php echo $match_styles; ?> }
        .<?php echo esc_html( $unmatch_class ); ?> { <?php echo $unmatch_styles; ?> }
    </style>
<?php endif; ?>

<div
    class="jg_blocks-responsive_display"
    data-media-query="<?php echo esc_attr( $media_query ); ?>"
    data-match-class="<?php echo esc_attr( $match_class ); ?>"
    data-unmatch-class="<?php echo esc_attr( $unmatch_class ); ?>"
>
    <?php echo $content ? wp_kses_post( $content ) : ''; ?>
</div>
