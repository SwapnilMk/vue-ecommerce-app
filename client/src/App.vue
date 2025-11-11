<template>
  <Suspense>
    <UApp>
      <UHeader>
        <template #left>
          <RouterLink to="/">
            Ecommerce App
          </RouterLink>
        </template>
        <template #right>
          <UColorModeButton />
          <UButton to="#" icon="simple-icons:cart" aria-label="cart" color="neutral" variant="ghost" />
        </template>
      </UHeader>

      <UMain>
        <RouterView />
      </UMain>

      <USeparator />

      <UFooter>
        <template #left>
          <p class="text-sm text-muted">
            Ecommerce App • © {{ new Date().getFullYear() }}
          </p>
        </template>

        <template #right>
          <p class="text-sm text-muted">
            Built with
            <a href="https://github.com/swapnilMk" target="_blank" rel="noopener noreferrer" class="underline">
              @swapnilMk
            </a>
          </p>
        </template>
      </UFooter>
    </UApp>
  </Suspense>
</template>
