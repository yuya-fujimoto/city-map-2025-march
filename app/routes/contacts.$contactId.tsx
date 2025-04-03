import MapComponent from '~/components/map';

export default function Contact() {
  return (
    <div
      id="contact"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: 0,
        margin: 0,
        maxWidth: 'none',
        display: 'block',
      }}
    >
      <MapComponent />
    </div>
  );
}
