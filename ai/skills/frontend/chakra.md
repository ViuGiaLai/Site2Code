# Chakra UI

> **Status: CUSTOM STUB** — Skill `chakra-ui/chakra-ui@chakra-ui-builder` tải thất bại từ skills.sh.
> Tham khảo: https://chakra-ui.com/docs

## Khi dùng trong Site2Code

Áp dụng khi user chọn **Chakra UI** làm component library.

## Quy tắc sinh code

1. Wrap app với `ChakraProvider`
2. Dùng layout primitives: `Box`, `Flex`, `Grid`, `Stack`, `Container`
3. Components: `Button`, `Heading`, `Text`, `Image`, `Input`, `Modal`
4. Responsive: `display={{ base: 'none', md: 'block' }}`
5. Theme tokens: `colorScheme`, `size`, `variant` — không hardcode màu

## Mapping layout → Chakra

| Section | Pattern |
|---------|---------|
| hero | `Container py={20}` + `Heading size="2xl"` |
| navbar | `Flex as="nav"` + `HStack` |
| features | `SimpleGrid columns={{ base: 1, md: 3 }}` |
| footer | `Box bg="gray.900" color="white" py={8}` |
