import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import {
  CssVarsProvider,
  useColorScheme,
  useTheme,
  styled,
  ColorPaletteProp,
  TypographySystem,
  createGetThemeVar,
} from '@mui/joy/styles';

const getThemeVar = createGetThemeVar();

const rgb2hex = (rgb: string) =>
  `#${(rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) || [])
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, '0'))
    .join('')}`;

const Typography = styled('p', {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'level' && prop !== 'sx',
})<{ color?: ColorPaletteProp; level?: keyof TypographySystem }>(
  ({ theme, level = 'body1', color }) => [
    { margin: 0 },
    theme.typography[level],
    color && color !== 'context' && { color: getThemeVar(`palette-${color}-textColor`) },
  ],
);

const ColorSchemePicker = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        borderRadius: theme.vars.radius.md,
        ...theme.variants.outlined.neutral,
      })}
    >
      <Box sx={{ display: 'flex', gap: '8px', p: '4px' }}>
        {(['light', 'dark'] as const).map((modeId) => {
          return (
            <Button
              key={modeId}
              size="sm"
              variant={mode === modeId ? 'contained' : 'text'}
              onClick={() => {
                setMode(modeId);
              }}
            >
              {modeId}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

const ColorToken = ({ name, value }: { name: string; value: string }) => {
  const [color, setColor] = React.useState('');
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (ref.current && typeof window !== 'undefined') {
      const style = window.getComputedStyle(ref.current);
      setColor(rgb2hex(style.backgroundColor));
    }
  }, []);
  return (
    <Box>
      <Box
        ref={ref}
        sx={(theme) => ({
          borderRadius: `calc(${theme.getThemeVar('radius-md')} / 2)`,
          bgcolor: value,
          width: 64,
          height: 64,
          mb: 1,
          boxShadow: theme.getThemeVar('shadow-sm'),
        })}
      />
      <Typography level="body3">{name}</Typography>
      <Typography level="body3">{color}</Typography>
    </Box>
  );
};

const PaletteTokens = () => {
  const { colorScheme } = useColorScheme();
  const { palette } = useTheme();
  return (
    <React.Fragment>
      <Typography level="h5" sx={{ mb: 1 }}>
        Palette ({colorScheme})
      </Typography>

      <Box>
        {Object.entries(palette).map(([key, nestedObj]) => {
          if (typeof nestedObj === 'string') {
            return <ColorToken key={key} name={key} value={nestedObj} />;
          }
          return (
            <details key={key} style={{ padding: '0.5rem 0' }}>
              <summary
                style={{
                  marginBottom: '0.5rem',
                  fontFamily: getThemeVar('fontFamily-body'),
                  cursor: 'pointer',
                }}
              >
                {key}
              </summary>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 2,
                }}
              >
                {Object.entries(nestedObj).map(([nestedKey, value]) => (
                  <ColorToken key={nestedKey} name={nestedKey} value={value as string} />
                ))}
              </Box>
            </details>
          );
        })}
      </Box>
    </React.Fragment>
  );
};

const TypographyScale = () => {
  const { typography } = useTheme();
  return (
    <React.Fragment>
      <Typography level="h5" sx={{ mb: 1 }}>
        Typography
      </Typography>

      {(Object.keys(typography) as Array<keyof TypographySystem>).map((level) => {
        return (
          <Typography key={level} level={level}>
            {level}
          </Typography>
        );
      })}
    </React.Fragment>
  );
};

export default function JoyStyleGuide() {
  return (
    <CssVarsProvider defaultMode="system">
      <Container>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            minHeight: 56,
            borderBottom: '1px solid',
            borderColor: 'neutral.outlinedBorder',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.body',
          }}
        >
          <ColorSchemePicker />
        </Box>
        <Box sx={{ p: 2 }}>
          <PaletteTokens />
        </Box>
        <Box sx={{ p: 2, display: 'flex', gap: 3 }}>
          <Box sx={{ minWidth: 300 }}>
            <TypographyScale />
          </Box>
          <Box>
            <Typography level="h5" sx={{ mb: 1 }}>
              UI Patterns
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, bgcolor: 'background.level2' }} />
              <Box>
                <Typography>List item title</Typography>
                <Typography level="body2">Secondary text.</Typography>
              </Box>
            </Box>
            <hr />
            <Box sx={{ display: 'flex', gap: 2, minWidth: 300 }}>
              <Box sx={{ width: 48, height: 48, bgcolor: 'background.level2' }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography>List item title</Typography>
                <Typography level="body2">Secondary text.</Typography>
              </Box>
              <Typography level="body3">metadata</Typography>
            </Box>
            <hr />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 64, height: 64, bgcolor: 'background.level2' }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography>List item title</Typography>
                <Typography level="body2">Secondary text.</Typography>
                <Typography level="body3">metadata</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
